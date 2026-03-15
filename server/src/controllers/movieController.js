const movieService = require('../services/movieService');

const movieController = {
  // Search for movies/shows
  async search(req, res) {
    try {
      const { q, page = 1 } = req.query;

      if (!q) {
        return res.status(400).json({ error: 'Search query is required' });
      }

      const results = await movieService.search(q, parseInt(page));
      res.json(results);
    } catch (error) {
      console.error('Search error:', error);
      res.status(500).json({ error: 'Failed to search movies' });
    }
  },

  // Get movie/show details
  async getDetails(req, res) {
    try {
      const { tmdbId } = req.params;
      const { mediaType = 'movie' } = req.query;

      const details = await movieService.getDetails(parseInt(tmdbId), mediaType);
      res.json(details);
    } catch (error) {
      console.error('Get details error:', error);
      res.status(500).json({ error: 'Failed to get movie details' });
    }
  },

  // Get popular content
  async getPopular(req, res) {
    try {
      const { mediaType = 'movie', page = 1 } = req.query;

      const results = await movieService.getPopular(mediaType, parseInt(page));
      res.json(results);
    } catch (error) {
      console.error('Get popular error:', error);
      res.status(500).json({ error: 'Failed to get popular content' });
    }
  },

  // Get trending content
  async getTrending(req, res) {
    try {
      const { mediaType = 'all', timeWindow = 'week' } = req.query;

      const results = await movieService.getTrending(mediaType, timeWindow);
      res.json(results);
    } catch (error) {
      console.error('Get trending error:', error);
      res.status(500).json({ error: 'Failed to get trending content' });
    }
  },

  // Get genres
  async getGenres(req, res) {
    try {
      const { mediaType = 'movie' } = req.query;

      const genres = await movieService.getGenres(mediaType);
      res.json(genres);
    } catch (error) {
      console.error('Get genres error:', error);
      res.status(500).json({ error: 'Failed to get genres' });
    }
  },
};

module.exports = movieController;
