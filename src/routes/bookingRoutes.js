const express = require('express');
const router = express.Router();
const bookingController = require('../controllers/bookingcontroller');
const auth = require('../middleware/auth');

router.get('/', auth, bookingController.getAllBookings);
router.get('/:type/:bookingId', auth, bookingController.getBookingById);
router.post('/:type/:bookingId/cancel', auth, bookingController.cancelBooking);

module.exports = router;
