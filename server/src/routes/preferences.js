const express = require('express');
const preferencesController = require('../controllers/preferencesController');

const router = express.Router();

// GET /api/preferences - Get user preferences
router.get('/', preferencesController.getPreferences);

// POST /api/preferences - Create/update preferences
router.post('/', preferencesController.updatePreferences);

module.exports = router;
