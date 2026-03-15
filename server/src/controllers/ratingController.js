const prisma = require('../config/database');

const ratingController = {
  // Create or update a rating
  async createRating(req, res) {
    try {
      const { userId, tmdbId, mediaType, rating, title } = req.body;

      if (!userId || !tmdbId || !mediaType || rating === undefined || !title) {
        return res.status(400).json({ error: 'Missing required fields' });
      }

      if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 0 and 5' });
      }

      const userRating = await prisma.userRating.upsert({
        where: {
          userId_tmdbId: {
            userId,
            tmdbId: parseInt(tmdbId),
          },
        },
        update: {
          rating: parseFloat(rating),
          watched: true,
        },
        create: {
          userId,
          tmdbId: parseInt(tmdbId),
          mediaType,
          rating: parseFloat(rating),
          title,
          watched: true,
        },
      });

      res.json(userRating);
    } catch (error) {
      console.error('Create rating error:', error);
      res.status(500).json({ error: 'Failed to save rating' });
    }
  },

  // Get user ratings
  async getUserRatings(req, res) {
    try {
      const { userId } = req.query;

      if (!userId) {
        return res.status(400).json({ error: 'userId is required' });
      }

      const ratings = await prisma.userRating.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
      });

      res.json(ratings);
    } catch (error) {
      console.error('Get ratings error:', error);
      res.status(500).json({ error: 'Failed to get ratings' });
    }
  },

  // Update a rating
  async updateRating(req, res) {
    try {
      const { id } = req.params;
      const { rating } = req.body;

      if (rating < 0 || rating > 5) {
        return res.status(400).json({ error: 'Rating must be between 0 and 5' });
      }

      const updated = await prisma.userRating.update({
        where: { id: parseInt(id) },
        data: { rating: parseFloat(rating) },
      });

      res.json(updated);
    } catch (error) {
      console.error('Update rating error:', error);
      res.status(500).json({ error: 'Failed to update rating' });
    }
  },

  // Delete a rating
  async deleteRating(req, res) {
    try {
      const { id } = req.params;

      await prisma.userRating.delete({
        where: { id: parseInt(id) },
      });

      res.json({ success: true });
    } catch (error) {
      console.error('Delete rating error:', error);
      res.status(500).json({ error: 'Failed to delete rating' });
    }
  },
};

module.exports = ratingController;
