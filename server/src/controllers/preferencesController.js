const prisma = require('../config/database');

const preferencesController = {
  // Get user preferences
  async getPreferences(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const preferences = await prisma.userPreference.findUnique({
        where: { userId },
      });

      res.json(preferences || {
        userId,
        preferredGenres: [],
        preferredPlatforms: ['netflix', 'hulu', 'prime'],
        minRating: 6.0,
        excludeGenres: [],
      });
    } catch (error) {
      console.error('Get preferences error:', error);
      res.status(500).json({ error: 'Failed to get preferences' });
    }
  },

  // Create or update preferences
  async updatePreferences(req, res) {
    try {
      const { userId, preferredGenres, preferredPlatforms, minRating, excludeGenres } = req.body;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const preferences = await prisma.userPreference.upsert({
        where: { userId },
        update: {
          preferredGenres: preferredGenres || [],
          preferredPlatforms: preferredPlatforms || ['netflix', 'hulu', 'prime'],
          minRating: minRating !== undefined ? parseFloat(minRating) : 6.0,
          excludeGenres: excludeGenres || [],
        },
        create: {
          userId,
          preferredGenres: preferredGenres || [],
          preferredPlatforms: preferredPlatforms || ['netflix', 'hulu', 'prime'],
          minRating: minRating !== undefined ? parseFloat(minRating) : 6.0,
          excludeGenres: excludeGenres || [],
        },
      });

      res.json(preferences);
    } catch (error) {
      console.error('Update preferences error:', error);
      res.status(500).json({ error: 'Failed to update preferences' });
    }
  },
};

module.exports = preferencesController;
