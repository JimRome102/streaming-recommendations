const prisma = require('../config/database');
const tmdbService = require('./external/tmdbService');
const redditService = require('./external/redditService');
const cacheService = require('./cacheService');

// Weights for the composite score (must sum to 1.0)
const WEIGHTS = {
  critics: 0.25,      // RT/Metacritic
  userRatings: 0.25,  // IMDb/TMDb
  socialTrends: 0.20, // Reddit engagement
  personalMatch: 0.30, // Genre overlap + viewing history
};

class RecommendationEngine {
  // Generate personalized recommendations
  async generateRecommendations(userId, options = {}) {
    try {
      const {
        count = 20,
        platforms = ['netflix', 'hulu', 'prime'],
        minRating = 6.0,
        excludeGenres = [],
      } = options;

      console.log(`🎬 Generating recommendations for user: ${userId}`);

      // Get user preferences and ratings
      const [preferences, userRatings] = await Promise.all([
        this.getUserPreferences(userId),
        this.getUserRatings(userId),
      ]);

      console.log(`📊 User has ${userRatings.length} ratings`);

      // Ensure user has rated enough content
      if (userRatings.length < 5) {
        throw new Error('Please rate at least 5 movies/shows before getting recommendations');
      }

      // Get genre preferences from user ratings if not set
      const preferredGenres = preferences?.preferredGenres?.length > 0
        ? preferences.preferredGenres
        : this.extractPreferredGenres(userRatings);

      console.log(`📊 Preferred genres: ${preferredGenres.join(', ')}`);

      // Only exclude items the user has already rated (allow recommendation repeats)
      const excludedTmdbIds = new Set([
        ...userRatings.map(r => r.tmdbId),
      ]);

      console.log(`📊 Excluding ${excludedTmdbIds.size} already seen/rated items`);

      // Discover candidate content
      const candidates = await this.discoverCandidates(preferredGenres, excludeGenres, platforms);
      console.log(`📊 Discovered ${candidates.length} candidates`);

      // Filter out already seen/recommended content
      const filteredCandidates = candidates.filter(c => !excludedTmdbIds.has(c.tmdbId));
      console.log(`📊 After filtering duplicates: ${filteredCandidates.length} candidates`);

      if (filteredCandidates.length === 0) {
        console.warn('⚠️ No candidates after filtering - returning empty recommendations');
        return [];
      }

      // Fetch full metadata for candidates
      const enrichedCandidates = await cacheService.batchGetContent(filteredCandidates);
      console.log(`📊 Enriched with metadata: ${enrichedCandidates.length} candidates`);

      if (enrichedCandidates.length === 0) {
        console.warn('⚠️ No enriched candidates - returning empty recommendations');
        return [];
      }

      // Score each candidate
      const scoredCandidates = await Promise.all(
        enrichedCandidates.map(async (content) => {
          const score = await this.calculateCompositeScore(content, userRatings, preferredGenres);
          return { ...content, score };
        })
      );
      console.log(`📊 Scored candidates: ${scoredCandidates.length}`);

      // Filter by minimum rating (be lenient with platform availability for now)
      const qualified = scoredCandidates.filter(c => {
        const avgRating = this.getAverageRating(c);
        const hasRating = avgRating >= minRating;
        // TODO: Re-enable strict platform filtering once Watchmode API coverage improves
        // For now, show content even without confirmed streaming availability
        return hasRating;
      });
      console.log(`📊 Qualified after rating/platform filter: ${qualified.length}`);

      if (qualified.length === 0) {
        console.warn('⚠️ No qualified candidates - returning empty recommendations');
        return [];
      }

      // Apply diversity filtering
      const diverseRecommendations = this.applyDiversityFilter(qualified, count);
      console.log(`📊 Final recommendations after diversity: ${diverseRecommendations.length}`);

      // Record recommendations
      await this.recordRecommendations(userId, diverseRecommendations);

      return diverseRecommendations;
    } catch (error) {
      console.error('❌ Error in generateRecommendations:', error.message);
      console.error('Stack:', error.stack);
      throw error;
    }
  }

  // Calculate weighted composite score (0-100)
  async calculateCompositeScore(content, userRatings, preferredGenres) {
    const criticsScore = this.calculateCriticsScore(content);
    const userRatingsScore = this.calculateUserRatingsScore(content);
    const socialScore = await this.calculateSocialScore(content);
    const personalScore = this.calculatePersonalMatchScore(content, userRatings, preferredGenres);

    const compositeScore =
      criticsScore * WEIGHTS.critics +
      userRatingsScore * WEIGHTS.userRatings +
      socialScore * WEIGHTS.socialTrends +
      personalScore * WEIGHTS.personalMatch;

    return Math.round(compositeScore * 100) / 100;
  }

  // Critics score (RT + Metacritic, normalized to 0-100)
  calculateCriticsScore(content) {
    const scores = [];

    if (content.rtScore) {
      scores.push(content.rtScore); // Already 0-100
    }

    // If we have other critic scores, add them here

    return scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 50; // Default to neutral if no critic scores
  }

  // User ratings score (IMDb + TMDb, normalized to 0-100)
  calculateUserRatingsScore(content) {
    const scores = [];

    if (content.imdbRating) {
      scores.push((content.imdbRating / 10) * 100); // Convert 0-10 to 0-100
    }

    if (content.tmdbRating) {
      scores.push((content.tmdbRating / 10) * 100); // Convert 0-10 to 0-100
    }

    return scores.length > 0
      ? scores.reduce((a, b) => a + b, 0) / scores.length
      : 50; // Default to neutral
  }

  // Social trends score (0-100)
  async calculateSocialScore(content) {
    // Check if we have cached social score
    if (content.socialScore !== null && content.socialScore !== undefined) {
      return content.socialScore;
    }

    // Search Reddit for this title
    const redditData = await redditService.searchTitle(content.title);
    const score = redditData.score || 0;

    // Update cached content with social score
    if (redditData.found) {
      await prisma.cachedContent.update({
        where: { tmdbId: content.tmdbId },
        data: { socialScore: score },
      });
    }

    return score;
  }

  // Personal match score based on genre overlap and viewing history (0-100)
  calculatePersonalMatchScore(content, userRatings, preferredGenres) {
    // Genre overlap score (0-60 points)
    const genreOverlap = content.genres.filter(g => preferredGenres.includes(g)).length;
    const genreScore = Math.min((genreOverlap / preferredGenres.length) * 60, 60);

    // Viewing history similarity (0-40 points)
    // Find similar rated content
    const similarRatings = userRatings.filter(rating => {
      // Find overlap in genres (need to fetch from cache, simplified here)
      return rating.rating >= 4; // Highly rated
    });

    const historyScore = Math.min((similarRatings.length / userRatings.length) * 40, 40);

    return genreScore + historyScore;
  }

  // Discover candidate content using TMDb
  async discoverCandidates(preferredGenres, excludeGenres, platforms, limit = 50) {
    const candidates = [];
    const seenIds = new Set();

    // 1. Get POPULAR content (high quality, well-known)
    try {
      const popularMovies = await tmdbService.getPopular('movie', 1);
      const popularTV = await tmdbService.getPopular('tv', 1);

      popularMovies.results.forEach(item => {
        if (!seenIds.has(item.tmdbId)) {
          candidates.push(item);
          seenIds.add(item.tmdbId);
        }
      });

      popularTV.results.forEach(item => {
        if (!seenIds.has(item.tmdbId)) {
          candidates.push(item);
          seenIds.add(item.tmdbId);
        }
      });
    } catch (error) {
      console.error('Popular content error:', error.message);
    }

    // 2. Get TRENDING content
    try {
      const trending = await tmdbService.getTrending('all', 'week');
      trending.forEach(item => {
        if (!seenIds.has(item.tmdbId)) {
          candidates.push(item);
          seenIds.add(item.tmdbId);
        }
      });
    } catch (error) {
      console.error('Trending content error:', error.message);
    }

    // 3. Discover by preferred genres (multiple pages for variety)
    for (const mediaType of ['movie', 'tv']) {
      for (let page = 1; page <= 3; page++) {
        try {
          const discovered = await tmdbService.discover(mediaType, {
            genres: preferredGenres.slice(0, 5),
            minRating: 6.5, // Higher threshold for quality
            page,
          });

          discovered.forEach(item => {
            if (!seenIds.has(item.tmdbId) && candidates.length < limit) {
              candidates.push(item);
              seenIds.add(item.tmdbId);
            }
          });

          if (candidates.length >= limit) break;
        } catch (error) {
          console.error(`Discovery error for ${mediaType} page ${page}:`, error.message);
        }
      }

      if (candidates.length >= limit) break;
    }

    console.log(`📊 Total unique candidates discovered: ${candidates.length}`);
    return candidates;
  }

  // Apply diversity filter to ensure variety
  applyDiversityFilter(candidates, count) {
    const genreCounts = new Map();
    const platformCounts = new Map();
    const selected = [];

    // Sort by score descending
    const sorted = candidates.sort((a, b) => b.score - a.score);

    // First pass: Try to get diverse content
    for (const candidate of sorted) {
      if (selected.length >= count) break;

      const mainGenre = candidate.genres[0];
      const genreCount = genreCounts.get(mainGenre) || 0;

      // More lenient genre limit (max 5 per genre)
      if (genreCount >= 5) continue;

      // Skip platform diversity check if we don't have platform data
      const platform = this.getPrimaryPlatform(candidate);

      // Add to selection
      selected.push(candidate);
      genreCounts.set(mainGenre, genreCount + 1);
      platformCounts.set(platform, (platformCounts.get(platform) || 0) + 1);
    }

    // Second pass: If we don't have enough, add more without genre restrictions
    if (selected.length < count) {
      const selectedIds = new Set(selected.map(s => s.tmdbId));
      for (const candidate of sorted) {
        if (selected.length >= count) break;
        if (!selectedIds.has(candidate.tmdbId)) {
          selected.push(candidate);
        }
      }
    }

    return selected.slice(0, count);
  }

  // Helper: Get user preferences
  async getUserPreferences(userId) {
    return await prisma.userPreference.findUnique({
      where: { userId },
    });
  }

  // Helper: Get user ratings
  async getUserRatings(userId) {
    return await prisma.userRating.findMany({
      where: { userId },
      orderBy: { rating: 'desc' },
    });
  }

  // Helper: Get hidden recommendations to exclude
  async getHiddenRecommendations(userId) {
    return await prisma.recommendationHistory.findMany({
      where: {
        userId,
        hidden: true,
      },
    });
  }

  // Helper: Record recommendations
  async recordRecommendations(userId, recommendations) {
    const records = recommendations.map(rec => ({
      userId,
      tmdbId: rec.tmdbId,
    }));

    await prisma.recommendationHistory.createMany({
      data: records,
      skipDuplicates: true,
    });
  }

  // Helper: Extract preferred genres from user ratings
  extractPreferredGenres(userRatings) {
    // For MVP: Return most popular genres to ensure broad discovery
    // TODO: In future, fetch actual genres from rated content via TMDb API
    return [
      18, // Drama (most common)
      28, // Action
      35, // Comedy
      80, // Crime
      878, // Science Fiction
      12, // Adventure
      53, // Thriller
      9648, // Mystery
      10751, // Family
      16, // Animation
    ];
  }

  // Helper: Get average rating from all sources
  getAverageRating(content) {
    const ratings = [];

    if (content.imdbRating) ratings.push(content.imdbRating);
    if (content.tmdbRating) ratings.push(content.tmdbRating);

    return ratings.length > 0
      ? ratings.reduce((a, b) => a + b, 0) / ratings.length
      : 0;
  }

  // Helper: Check if content is on specified platforms
  isOnPlatform(content, platforms) {
    // If no streaming data available, allow it through
    if (!content.streamingPlatforms) return true;

    // Check if available on any of the requested platforms
    const isAvailable = platforms.some(p => content.streamingPlatforms[p] === true);

    // If Watchmode returns all false (no data), also allow through
    // This handles cases where the API doesn't have streaming info yet
    const allFalse = Object.values(content.streamingPlatforms)
      .filter(v => typeof v === 'boolean')
      .every(v => v === false);

    return isAvailable || allFalse;
  }

  // Helper: Get primary platform for diversity
  getPrimaryPlatform(content) {
    if (!content.streamingPlatforms) return 'none';

    for (const platform of ['netflix', 'hulu', 'prime']) {
      if (content.streamingPlatforms[platform]) return platform;
    }

    return 'none';
  }

  // Hide a recommendation
  async hideRecommendation(userId, tmdbId) {
    return await prisma.recommendationHistory.updateMany({
      where: { userId, tmdbId },
      data: { hidden: true },
    });
  }

  // Clear recommendation history for a user
  async clearRecommendationHistory(userId) {
    const result = await prisma.recommendationHistory.deleteMany({
      where: { userId },
    });
    return result.count;
  }
}

module.exports = new RecommendationEngine();
