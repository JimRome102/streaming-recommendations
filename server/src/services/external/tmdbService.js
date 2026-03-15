const axios = require('axios');
const config = require('../../config/env');
const redis = require('../../config/redis');

class TMDbService {
  constructor() {
    this.apiKey = config.apis.tmdb.key;
    this.baseUrl = config.apis.tmdb.baseUrl;
    this.imageBaseUrl = config.apis.tmdb.imageBaseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      params: {
        api_key: this.apiKey,
      },
    });
  }

  // Search movies and TV shows
  async search(query, page = 1) {
    const cacheKey = `tmdb:search:${query}:${page}`;

    // Check Redis cache if available
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const response = await this.client.get('/search/multi', {
        params: {
          query,
          page,
          include_adult: false,
        },
      });

      const results = response.data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(item => this.formatSearchResult(item));

      const data = {
        results,
        page: response.data.page,
        totalPages: response.data.total_pages,
        totalResults: response.data.total_results,
      };

      // Cache in Redis if available
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.searchResults, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error('TMDb search error:', error.message);
      throw new Error('Failed to search movies/shows');
    }
  }

  // Get detailed information about a movie
  async getMovieDetails(tmdbId) {
    const cacheKey = `tmdb:movie:${tmdbId}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const [details, credits, externalIds] = await Promise.all([
        this.client.get(`/movie/${tmdbId}`),
        this.client.get(`/movie/${tmdbId}/credits`),
        this.client.get(`/movie/${tmdbId}/external_ids`),
      ]);

      const data = this.formatMovieDetails(details.data, credits.data, externalIds.data);
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.movieMetadata, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error(`TMDb movie details error (ID: ${tmdbId}):`, error.message);
      throw new Error('Failed to fetch movie details');
    }
  }

  // Get detailed information about a TV show
  async getTVDetails(tmdbId) {
    const cacheKey = `tmdb:tv:${tmdbId}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const [details, credits, externalIds] = await Promise.all([
        this.client.get(`/tv/${tmdbId}`),
        this.client.get(`/tv/${tmdbId}/credits`),
        this.client.get(`/tv/${tmdbId}/external_ids`),
      ]);

      const data = this.formatTVDetails(details.data, credits.data, externalIds.data);
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.movieMetadata, JSON.stringify(data));
      }
      return data;
    } catch (error) {
      console.error(`TMDb TV details error (ID: ${tmdbId}):`, error.message);
      throw new Error('Failed to fetch TV show details');
    }
  }

  // Get popular movies
  async getPopular(mediaType = 'movie', page = 1) {
    const cacheKey = `tmdb:popular:${mediaType}:${page}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const endpoint = mediaType === 'movie' ? '/movie/popular' : '/tv/popular';
      const response = await this.client.get(endpoint, { params: { page } });

      const results = response.data.results.map(item =>
        this.formatSearchResult({ ...item, media_type: mediaType })
      );

      const data = {
        results,
        page: response.data.page,
        totalPages: response.data.total_pages,
      };

      if (redis) {
        await redis.setex(cacheKey, 3600, JSON.stringify(data)); // 1 hour cache
      }
      return data;
    } catch (error) {
      console.error('TMDb popular error:', error.message);
      throw new Error('Failed to fetch popular content');
    }
  }

  // Get trending content
  async getTrending(mediaType = 'all', timeWindow = 'week') {
    const cacheKey = `tmdb:trending:${mediaType}:${timeWindow}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const response = await this.client.get(`/trending/${mediaType}/${timeWindow}`);

      const results = response.data.results
        .filter(item => item.media_type === 'movie' || item.media_type === 'tv')
        .map(item => this.formatSearchResult(item));

      if (redis) {
        await redis.setex(cacheKey, 3600, JSON.stringify(results)); // 1 hour cache
      }
      return results;
    } catch (error) {
      console.error('TMDb trending error:', error.message);
      throw new Error('Failed to fetch trending content');
    }
  }

  // Discover movies/shows by genre
  async discover(mediaType = 'movie', options = {}) {
    const { genres, minRating, page = 1 } = options;
    const params = { page };

    if (genres && genres.length > 0) {
      params.with_genres = genres.join(',');
    }
    if (minRating) {
      params['vote_average.gte'] = minRating;
      params.vote_count_gte = 100; // Ensure enough votes for reliability
    }

    try {
      const endpoint = mediaType === 'movie' ? '/discover/movie' : '/discover/tv';
      const response = await this.client.get(endpoint, { params });

      return response.data.results.map(item =>
        this.formatSearchResult({ ...item, media_type: mediaType })
      );
    } catch (error) {
      console.error('TMDb discover error:', error.message);
      throw new Error('Failed to discover content');
    }
  }

  // Get available genres
  async getGenres(mediaType = 'movie') {
    const cacheKey = `tmdb:genres:${mediaType}`;

    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const endpoint = mediaType === 'movie' ? '/genre/movie/list' : '/genre/tv/list';
      const response = await this.client.get(endpoint);

      if (redis) {
        await redis.setex(cacheKey, 7 * 24 * 3600, JSON.stringify(response.data.genres)); // 7 days
      }
      return response.data.genres;
    } catch (error) {
      console.error('TMDb genres error:', error.message);
      throw new Error('Failed to fetch genres');
    }
  }

  // Format search result
  formatSearchResult(item) {
    return {
      tmdbId: item.id,
      title: item.title || item.name,
      originalTitle: item.original_title || item.original_name,
      mediaType: item.media_type,
      overview: item.overview,
      posterPath: item.poster_path ? `${this.imageBaseUrl}/w500${item.poster_path}` : null,
      backdropPath: item.backdrop_path ? `${this.imageBaseUrl}/w1280${item.backdrop_path}` : null,
      releaseDate: item.release_date || item.first_air_date,
      rating: item.vote_average,
      voteCount: item.vote_count,
      popularity: item.popularity,
      genreIds: item.genre_ids || [],
    };
  }

  // Format movie details
  formatMovieDetails(details, credits, externalIds) {
    return {
      tmdbId: details.id,
      imdbId: externalIds.imdb_id,
      title: details.title,
      originalTitle: details.original_title,
      mediaType: 'movie',
      overview: details.overview,
      posterPath: details.poster_path ? `${this.imageBaseUrl}/w500${details.poster_path}` : null,
      backdropPath: details.backdrop_path ? `${this.imageBaseUrl}/w1280${details.backdrop_path}` : null,
      genres: details.genres.map(g => ({ id: g.id, name: g.name })),
      genreIds: details.genres.map(g => g.id),
      releaseDate: details.release_date,
      runtime: details.runtime,
      rating: details.vote_average,
      voteCount: details.vote_count,
      popularity: details.popularity,
      tagline: details.tagline,
      status: details.status,
      budget: details.budget,
      revenue: details.revenue,
      cast: credits.cast.slice(0, 10).map(c => ({ name: c.name, character: c.character })),
      director: credits.crew.find(c => c.job === 'Director')?.name,
    };
  }

  // Format TV show details
  formatTVDetails(details, credits, externalIds) {
    return {
      tmdbId: details.id,
      imdbId: externalIds.imdb_id,
      title: details.name,
      originalTitle: details.original_name,
      mediaType: 'tv',
      overview: details.overview,
      posterPath: details.poster_path ? `${this.imageBaseUrl}/w500${details.poster_path}` : null,
      backdropPath: details.backdrop_path ? `${this.imageBaseUrl}/w1280${details.backdrop_path}` : null,
      genres: details.genres.map(g => ({ id: g.id, name: g.name })),
      genreIds: details.genres.map(g => g.id),
      firstAirDate: details.first_air_date,
      lastAirDate: details.last_air_date,
      numberOfSeasons: details.number_of_seasons,
      numberOfEpisodes: details.number_of_episodes,
      episodeRunTime: details.episode_run_time[0],
      rating: details.vote_average,
      voteCount: details.vote_count,
      popularity: details.popularity,
      tagline: details.tagline,
      status: details.status,
      cast: credits.cast.slice(0, 10).map(c => ({ name: c.name, character: c.character })),
      creators: details.created_by.map(c => c.name),
    };
  }

  // Get poster URL
  getPosterUrl(path, size = 'w500') {
    return path ? `${this.imageBaseUrl}/${size}${path}` : null;
  }
}

module.exports = new TMDbService();
