const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightcontroller');
const auth = require('../middleware/auth');

// @route GET /api/flights/search
// @desc  Search flights
router.get('/search', flightController.searchFlights);

// @route POST /api/flights/book
// @desc  Book a flight (requires authentication)
router.post('/book', auth, flightController.bookFlight);

module.exports = router;
