const recommendationEngine = require('../services/recommendationEngine');

const recommendationController = {
  // Get recommendations for user
  async getRecommendations(req, res) {
    try {
      const { userId, count = 20, platform } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      // Parse platforms
      const platforms = platform
        ? platform.split(',')
        : ['netflix', 'hulu', 'prime'];

      const options = {
        count: parseInt(count),
        platforms,
      };

      const recommendations = await recommendationEngine.generateRecommendations(userId, options);

      res.json({
        recommendations,
        count: recommendations.length,
        platforms,
      });
    } catch (error) {
      console.error('Get recommendations error:', error.message);
      console.error('Error stack:', error.stack);

      if (error.message.includes('rate at least')) {
        return res.status(400).json({ error: error.message });
      }

      res.status(500).json({ error: 'Failed to generate recommendations' });
    }
  },

  // Hide a recommendation
  async hideRecommendation(req, res) {
    try {
      const { tmdbId } = req.params;
      const { userId } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      await recommendationEngine.hideRecommendation(userId, parseInt(tmdbId));

      res.json({ success: true });
    } catch (error) {
      console.error('Hide recommendation error:', error);
      res.status(500).json({ error: 'Failed to hide recommendation' });
    }
  },

  // Clear recommendation history (for testing/reset)
  async clearHistory(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const count = await recommendationEngine.clearRecommendationHistory(userId);

      res.json({
        success: true,
        message: `Cleared ${count} recommendation history entries`,
        count
      });
    } catch (error) {
      console.error('Clear history error:', error);
      res.status(500).json({ error: 'Failed to clear recommendation history' });
    }
  },
};

module.exports = recommendationController;
