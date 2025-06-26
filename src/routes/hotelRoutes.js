const express = require('express');
const router = express.Router();
const hotelController = require('../controllers/hotelcontroller');

// GET /api/hotels/search?city=Goa&checkIn=2024-07-10&checkOut=2024-07-12
router.get('/search', hotelController.searchHotels);

// POST /api/hotels/book
router.post('/book', hotelController.bookHotelRoom);

module.exports = router;