const axios = require('axios');
const config = require('../../config/env');
const redis = require('../../config/redis');

class OMDbService {
  constructor() {
    this.apiKey = config.apis.omdb.key;
    this.baseUrl = config.apis.omdb.baseUrl;
  }

  // Get movie/show details by IMDb ID
  async getByImdbId(imdbId) {
    if (!this.apiKey || this.apiKey === 'your_omdb_key_here') {
      console.warn('OMDb API key not configured');
      return null;
    }

    const cacheKey = `omdb:${imdbId}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const response = await axios.get(this.baseUrl, {
        params: {
          apikey: this.apiKey,
          i: imdbId,
          plot: 'short',
        },
      });

      if (response.data.Response === 'False') {
        return null;
      }

      const data = this.formatResponse(response.data);
      await redis.setex(cacheKey, config.cache.ttl.movieMetadata, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`OMDb error (IMDb ID: ${imdbId}):`, error.message);
      return null;
    }
  }

  // Get movie/show details by title
  async getByTitle(title, year = null) {
    if (!this.apiKey || this.apiKey === 'your_omdb_key_here') {
      return null;
    }

    const cacheKey = `omdb:title:${title}:${year || 'any'}`;
    const cached = await redis.get(cacheKey);

    if (cached) {
      return JSON.parse(cached);
    }

    try {
      const params = {
        apikey: this.apiKey,
        t: title,
        plot: 'short',
      };

      if (year) {
        params.y = year;
      }

      const response = await axios.get(this.baseUrl, { params });

      if (response.data.Response === 'False') {
        return null;
      }

      const data = this.formatResponse(response.data);
      await redis.setex(cacheKey, config.cache.ttl.movieMetadata, JSON.stringify(data));
      return data;
    } catch (error) {
      console.error(`OMDb error (Title: ${title}):`, error.message);
      return null;
    }
  }

  // Format OMDb response
  formatResponse(data) {
    // Extract Rotten Tomatoes score
    let rtScore = null;
    const rtRating = data.Ratings?.find(r => r.Source === 'Rotten Tomatoes');
    if (rtRating) {
      rtScore = parseInt(rtRating.Value.replace('%', ''));
    }

    // Extract IMDb rating
    const imdbRating = data.imdbRating && data.imdbRating !== 'N/A'
      ? parseFloat(data.imdbRating)
      : null;

    return {
      imdbId: data.imdbID,
      title: data.Title,
      year: data.Year,
      rated: data.Rated,
      runtime: data.Runtime,
      genre: data.Genre,
      director: data.Director,
      actors: data.Actors,
      plot: data.Plot,
      language: data.Language,
      country: data.Country,
      awards: data.Awards,
      imdbRating,
      imdbVotes: data.imdbVotes,
      rtScore,
      metascore: data.Metascore && data.Metascore !== 'N/A' ? parseInt(data.Metascore) : null,
      type: data.Type, // movie, series, or episode
      boxOffice: data.BoxOffice,
    };
  }

  // Get ratings data (IMDb + RT)
  async getRatings(imdbId, title = null) {
    const data = imdbId
      ? await this.getByImdbId(imdbId)
      : title
      ? await this.getByTitle(title)
      : null;

    if (!data) {
      return {
        imdbRating: null,
        rtScore: null,
        metascore: null,
      };
    }

    return {
      imdbRating: data.imdbRating,
      rtScore: data.rtScore,
      metascore: data.metascore,
    };
  }
}

module.exports = new OMDbService();
