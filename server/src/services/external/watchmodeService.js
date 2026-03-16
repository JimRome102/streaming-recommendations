const axios = require('axios');
const config = require('../../config/env');
const redis = require('../../config/redis');

// Watchmode source IDs for major platforms
const PLATFORM_IDS = {
  netflix: 203,
  hulu: 157,
  prime: 26,       // Amazon Prime Video
  hbo: 387,        // Max (HBO Max)
  disney: 372,     // Disney+
  paramount: 444,  // Paramount+
  showtime: 37,    // Showtime
  peacock: 389,    // Peacock
};

class WatchmodeService {
  constructor() {
    this.apiKey = config.apis.watchmode.key;
    this.baseUrl = config.apis.watchmode.baseUrl;
    this.client = axios.create({
      baseURL: this.baseUrl,
      params: {
        apiKey: this.apiKey,
      },
    });
  }

  // Search for a title to get Watchmode ID
  async searchTitle(title, mediaType) {
    const cacheKey = `watchmode:search:${title}:${mediaType}`;

    // Check Redis cache if available
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const response = await this.client.get('/search/', {
        params: {
          search_field: 'name',
          search_value: title,
        },
      });

      const results = response.data.title_results || [];
      // Filter by media type if possible
      const filtered = mediaType
        ? results.filter(r => r.type === (mediaType === 'movie' ? 'movie' : 'tv_series'))
        : results;

      const data = filtered.length > 0 ? filtered[0] : null;

      // Cache if Redis is available
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.searchResults, JSON.stringify(data));
      }

      return data;
    } catch (error) {
      console.error('Watchmode search error:', error.message);
      return null;
    }
  }

  // Get streaming availability by Watchmode ID
  async getStreamingAvailability(watchmodeId) {
    const cacheKey = `watchmode:sources:${watchmodeId}`;

    // Check Redis cache if available
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      const response = await this.client.get(`/title/${watchmodeId}/sources/`);
      const sources = response.data || [];

      const availability = {
        netflix: sources.some(s => s.source_id === PLATFORM_IDS.netflix),
        hulu: sources.some(s => s.source_id === PLATFORM_IDS.hulu),
        prime: sources.some(s => s.source_id === PLATFORM_IDS.prime),
        hbo: sources.some(s => s.source_id === PLATFORM_IDS.hbo),
        disney: sources.some(s => s.source_id === PLATFORM_IDS.disney),
        paramount: sources.some(s => s.source_id === PLATFORM_IDS.paramount),
        showtime: sources.some(s => s.source_id === PLATFORM_IDS.showtime),
        peacock: sources.some(s => s.source_id === PLATFORM_IDS.peacock),
        lastUpdated: new Date().toISOString(),
      };

      // Cache if Redis is available
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.streamingAvailability, JSON.stringify(availability));
      }

      return availability;
    } catch (error) {
      console.error(`Watchmode availability error (ID: ${watchmodeId}):`, error.message);
      return {
        netflix: false, hulu: false, prime: false, hbo: false,
        disney: false, paramount: false, showtime: false, peacock: false,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Get streaming availability by title and media type
  async getStreamingAvailabilityByTitle(title, mediaType) {
    try {
      const searchResult = await this.searchTitle(title, mediaType);
      if (!searchResult) {
        return {
          netflix: false, hulu: false, prime: false, hbo: false,
          disney: false, paramount: false, showtime: false, peacock: false,
          lastUpdated: new Date().toISOString()
        };
      }

      return await this.getStreamingAvailability(searchResult.id);
    } catch (error) {
      console.error('Watchmode availability by title error:', error.message);
      return { netflix: false, hulu: false, prime: false, lastUpdated: new Date().toISOString() };
    }
  }

  // Get streaming availability by IMDb ID
  async getStreamingAvailabilityByImdbId(imdbId) {
    const cacheKey = `watchmode:imdb:${imdbId}`;

    // Check Redis cache if available
    if (redis) {
      const cached = await redis.get(cacheKey);
      if (cached) {
        return JSON.parse(cached);
      }
    }

    try {
      // First, find the Watchmode ID using IMDb ID
      const response = await this.client.get('/search/', {
        params: {
          search_field: 'imdb_id',
          search_value: imdbId,
        },
      });

      const results = response.data.title_results || [];
      if (results.length === 0) {
        return {
          netflix: false, hulu: false, prime: false, hbo: false,
          disney: false, paramount: false, showtime: false, peacock: false,
          lastUpdated: new Date().toISOString()
        };
      }

      const availability = await this.getStreamingAvailability(results[0].id);

      // Cache if Redis is available
      if (redis) {
        await redis.setex(cacheKey, config.cache.ttl.streamingAvailability, JSON.stringify(availability));
      }

      return availability;
    } catch (error) {
      console.error(`Watchmode IMDb availability error (${imdbId}):`, error.message);
      return {
        netflix: false, hulu: false, prime: false, hbo: false,
        disney: false, paramount: false, showtime: false, peacock: false,
        lastUpdated: new Date().toISOString()
      };
    }
  }

  // Check if available on any of the specified platforms
  isAvailableOnPlatforms(availability, platforms) {
    if (!platforms || platforms.length === 0) return true;
    return platforms.some(platform => availability[platform] === true);
  }
}

module.exports = new WatchmodeService();
