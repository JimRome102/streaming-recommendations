const express = require('express');
const recommendationController = require('../controllers/recommendationController');

const router = express.Router();

// GET /api/recommendations - Get personalized recommendations
router.get('/', recommendationController.getRecommendations);

// POST /api/recommendations/hide/:tmdbId - Hide a recommendation
router.post('/hide/:tmdbId', recommendationController.hideRecommendation);

// DELETE /api/recommendations/history - Clear recommendation history (for testing)
router.delete('/history', recommendationController.clearHistory);

module.exports = router;
