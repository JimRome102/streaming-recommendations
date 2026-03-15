const tmdbService = require('./external/tmdbService');
const cacheService = require('./cacheService');

class MovieService {
  // Search for movies/shows
  async search(query, page = 1) {
    return await tmdbService.search(query, page);
  }

  // Get movie/show details
  async getDetails(tmdbId, mediaType) {
    return await cacheService.getContent(tmdbId, mediaType);
  }

  // Get popular content
  async getPopular(mediaType = 'movie', page = 1) {
    return await tmdbService.getPopular(mediaType, page);
  }

  // Get trending content
  async getTrending(mediaType = 'all', timeWindow = 'week') {
    return await tmdbService.getTrending(mediaType, timeWindow);
  }

  // Get available genres
  async getGenres(mediaType = 'movie') {
    return await tmdbService.getGenres(mediaType);
  }
}

module.exports = new MovieService();
