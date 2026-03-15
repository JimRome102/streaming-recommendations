const express = require('express');
const movieController = require('../controllers/movieController');

const router = express.Router();

// GET /api/movies/search - Search movies/shows
router.get('/search', movieController.search);

// GET /api/movies/popular - Get popular content
router.get('/popular', movieController.getPopular);

// GET /api/movies/trending - Get trending content
router.get('/trending', movieController.getTrending);

// GET /api/movies/genres - Get available genres
router.get('/genres', movieController.getGenres);

// GET /api/movies/:tmdbId - Get movie/show details
router.get('/:tmdbId', movieController.getDetails);

module.exports = router;
