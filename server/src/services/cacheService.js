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

      // Try to fetch streaming availability (non-blocking)
      let streaming = null;
      try {
        streaming = tmdbData.imdbId
          ? await watchmodeService.getStreamingAvailabilityByImdbId(tmdbData.imdbId)
          : await watchmodeService.getStreamingAvailabilityByTitle(tmdbData.title, mediaType);
      } catch (err) {
        console.warn(`Watchmode API failed for ${tmdbId}, continuing without streaming data`);
      }

      // Try to fetch additional ratings (non-blocking)
      let ratings = { imdbRating: null, rtScore: null };
      if (tmdbData.imdbId) {
        try {
          ratings = await omdbService.getRatings(tmdbData.imdbId);
        } catch (err) {
          console.warn(`OMDb API failed for ${tmdbId}, continuing without IMDb/RT data`);
        }
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

  // Batch fetch and cache multiple items with rate limiting
  async batchGetContent(items) {
    // First, check which items are already in cache
    const tmdbIds = items.map(item => item.tmdbId);
    const cached = await prisma.cachedContent.findMany({
      where: {
        tmdbId: { in: tmdbIds },
      },
    });

    console.log(`💾 Found ${cached.length}/${items.length} items in cache`);

    // Separate cached from items that need fetching
    const cachedMap = new Map(cached.map(c => [c.tmdbId, c]));
    const itemsToFetch = items.filter(item => {
      const cachedItem = cachedMap.get(item.tmdbId);
      // Only fetch if not cached or cache is old (>7 days)
      return !cachedItem || !this.isCacheValid(cachedItem.updatedAt, 7);
    });

    console.log(`🔄 Need to fetch ${itemsToFetch.length} new/stale items`);

    const allResults = [...cached.filter(c => this.isCacheValid(c.updatedAt, 7))];

    // If nothing to fetch, return cached items
    if (itemsToFetch.length === 0) {
      return allResults;
    }

    // Fetch all items concurrently (cache checks prevent excessive API calls)
    console.log(`📦 Fetching ${itemsToFetch.length} items concurrently...`);

    const results = await Promise.allSettled(
      itemsToFetch.map(item => this.getContent(item.tmdbId, item.mediaType))
    );

    const fulfilled = results
      .filter(r => r.status === 'fulfilled')
      .map(r => r.value);

    const rejected = results.filter(r => r.status === 'rejected').length;
    console.log(`✅ Fetch complete: ${fulfilled.length} succeeded, ${rejected} failed`);

    allResults.push(...fulfilled);

    console.log(`📊 Total available: ${allResults.length}/${items.length} items (${cached.length} from cache, ${allResults.length - cached.length} newly fetched)`);
    return allResults;
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
