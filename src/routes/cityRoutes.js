// src/routes/cityRoutes.js
const express = require('express');
const router = express.Router();
const cityController = require('../controllers/citycontroller');

// @route GET /api/cities
router.get('/', cityController.getCities);

module.exports = router;
