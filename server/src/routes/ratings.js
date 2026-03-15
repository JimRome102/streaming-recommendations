const express = require('express');
const ratingController = require('../controllers/ratingController');

const router = express.Router();

// POST /api/ratings - Create/update a rating
router.post('/', ratingController.createRating);

// GET /api/ratings - Get user ratings
router.get('/', ratingController.getUserRatings);

// PUT /api/ratings/:id - Update a rating
router.put('/:id', ratingController.updateRating);

// DELETE /api/ratings/:id - Delete a rating
router.delete('/:id', ratingController.deleteRating);

module.exports = router;
