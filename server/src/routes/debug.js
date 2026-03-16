const express = require('express');
const prisma = require('../config/database');
const tmdbService = require('../services/external/tmdbService');

const router = express.Router();

// Debug endpoint to trace recommendation generation
router.get('/trace/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    const trace = {};

    // 1. Check user ratings
    const ratings = await prisma.userRating.findMany({
      where: { userId }
    });
    trace.ratingsCount = ratings.length;
    trace.ratings = ratings.map(r => ({ title: r.title, rating: r.rating }));

    // 2. Check hidden recommendations
    const hidden = await prisma.recommendationHistory.findMany({
      where: { userId, hidden: true }
    });
    trace.hiddenCount = hidden.length;

    // 3. Try to discover candidates
    trace.discovery = {};
    try {
      const popular = await tmdbService.getPopular('movie', 1);
      trace.discovery.popularMoviesCount = popular.results?.length || 0;
      trace.discovery.popularMoviesSample = popular.results?.slice(0, 3).map(m => m.title) || [];
    } catch (err) {
      trace.discovery.popularError = err.message;
    }

    try {
      const trending = await tmdbService.getTrending('all', 'week');
      trace.discovery.trendingCount = trending?.length || 0;
      trace.discovery.trendingSample = trending?.slice(0, 3).map(m => m.title) || [];
    } catch (err) {
      trace.discovery.trendingError = err.message;
    }

    // 4. Check cached content
    const cached = await prisma.cachedContent.count();
    trace.cachedContentCount = cached;

    res.json(trace);
  } catch (error) {
    res.status(500).json({ error: error.message, stack: error.stack });
  }
});

module.exports = router;
