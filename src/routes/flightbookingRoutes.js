const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/flightbookingcontroller');

router.post('/book', bookingController.bookFlight);

module.exports = router;
