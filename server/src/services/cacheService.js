const prisma = require('../config/database');
const redis = require('../config/redis');
const tmdbService = require('./external/tmdbService');
const watchmodeService = require('./external/watchmodeService');
const omdbService = require('./external/omdbService');

class CacheService {
  // Get or fetch movie/show metadata
  async getContent(tmdbId, mediaType) {
    // Check database cache first
    let cached = await prisma.cachedContent.findUnique({
      where: { tmdbId },
    });

    // If cached and not too old (7 days), return it
    if (cached && this.isCacheValid(cached.updatedAt, 7)) {
      return cached;
    }

    // Fetch from external APIs
    const content = await this.fetchAndCacheContent(tmdbId, mediaType);
    return content;
  }

  // Fetch content from external APIs and cache it
  async fetchAndCacheContent(tmdbId, mediaType) {
    try {
      // Fetch from TMDb
      const tmdbData = mediaType === 'movie'
        ? await tmdbService.getMovieDetails(tmdbId)
        : await tmdbService.getTVDetails(tmdbId);

      // Fetch streaming availability
      const streaming = tmdbData.imdbId
        ? await watchmodeService.getStreamingAvailabilityByImdbId(tmdbData.imdbId)
        : await watchmodeService.getStreamingAvailabilityByTitle(tmdbData.title, mediaType);

      // Fetch additional ratings (IMDb, RT)
      let ratings = { imdbRating: null, rtScore: null };
      if (tmdbData.imdbId) {
        ratings = await omdbService.getRatings(tmdbData.imdbId);
      }

      // Prepare data for database
      const contentData = {
        tmdbId,
        title: tmdbData.title,
        overview: tmdbData.overview,
        posterPath: tmdbData.posterPath,
        backdropPath: tmdbData.backdropPath,
        mediaType: tmdbData.mediaType,
        genres: tmdbData.genreIds,
        releaseDate: tmdbData.releaseDate || tmdbData.firstAirDate,
        tmdbRating: tmdbData.rating,
        tmdbVoteCount: tmdbData.voteCount,
        imdbRating: ratings.imdbRating,
        imdbId: tmdbData.imdbId,
        rtScore: ratings.rtScore,
        streamingPlatforms: streaming,
        popularity: tmdbData.popularity,
        runtime: tmdbData.runtime || tmdbData.episodeRunTime,
      };

      // Upsert to database
      const content = await prisma.cachedContent.upsert({
        where: { tmdbId },
        update: contentData,
        create: contentData,
      });

      return content;
    } catch (error) {
      console.error(`Error fetching content (TMDb ID: ${tmdbId}):`, error.message);
      throw error;
    }
  }

  // Batch fetch and cache multiple items
  async batchGetContent(items) {
    const results = await Promise.allSettled(
      items.map(item => this.getContent(item.tmdbId, item.mediaType))
    );

    return results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);
  }

  // Update streaming availability for cached content
  async updateStreamingAvailability(tmdbId) {
    const content = await prisma.cachedContent.findUnique({
      where: { tmdbId },
    });

    if (!content) {
      return null;
    }

    const streaming = content.imdbId
      ? await watchmodeService.getStreamingAvailabilityByImdbId(content.imdbId)
      : await watchmodeService.getStreamingAvailabilityByTitle(content.title, content.mediaType);

    return await prisma.cachedContent.update({
      where: { tmdbId },
      data: { streamingPlatforms: streaming },
    });
  }

  // Check if cache is still valid
  isCacheValid(updatedAt, maxDays) {
    const now = new Date();
    const cacheAge = (now - new Date(updatedAt)) / (1000 * 60 * 60 * 24); // days
    return cacheAge < maxDays;
  }

  // Clear old cache entries
  async clearOldCache(maxDays = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - maxDays);

    const result = await prisma.cachedContent.deleteMany({
      where: {
        updatedAt: {
          lt: cutoffDate,
        },
      },
    });

    console.log(`Cleared ${result.count} old cache entries`);
    return result.count;
  }

  // Get Redis cache stats
  async getCacheStats() {
    const info = await redis.info('stats');
    const dbSize = await redis.dbsize();

    return {
      redisKeys: dbSize,
      redisInfo: info,
    };
  }

  // Clear Redis cache
  async clearRedisCache(pattern = '*') {
    const keys = await redis.keys(pattern);
    if (keys.length > 0) {
      await redis.del(...keys);
    }
    return keys.length;
  }
}

module.exports = new CacheService();
