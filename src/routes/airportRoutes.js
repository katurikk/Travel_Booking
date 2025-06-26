// src/routes/airportRoutes.js
const express = require('express');
const router = express.Router();
const airportController = require('../controllers/airportcontroller');

// @route GET /api/airports?search=delhi
router.get('/', airportController.getAirports);

module.exports = router;
