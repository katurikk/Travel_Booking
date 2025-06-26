const db = require('../config/database');

// 🧾 Get All User Bookings
exports.getAllBookings = (req, res) => {
  const userId = req.user.id;

  const queries = {
    flights: `SELECT * FROM flight_bookings WHERE user_id = ?`,
    hotels: `SELECT * FROM hotel_bookings WHERE user_id = ?`,
    packages: `SELECT * FROM package_bookings WHERE user_id = ?`
  };

  const bookings = {};

  db.all(queries.flights, [userId], (err, flightRows) => {
    if (err) return res.status(500).json({ success: false, message: 'Flight fetch error', error: err.message });

    bookings.flights = flightRows;

    db.all(queries.hotels, [userId], (err, hotelRows) => {
      if (err) return res.status(500).json({ success: false, message: 'Hotel fetch error', error: err.message });

      bookings.hotels = hotelRows;

      db.all(queries.packages, [userId], (err, packageRows) => {
        if (err) return res.status(500).json({ success: false, message: 'Package fetch error', error: err.message });

        bookings.packages = packageRows;

        res.json({
          success: true,
          bookings
        });
      });
    });
  });
};

// 🔍 Get Booking by ID & Type
exports.getBookingById = (req, res) => {
  const userId = req.user.id;
  const { type, bookingId } = req.params;

  const tableMap = {
    flight: 'flight_bookings',
    hotel: 'hotel_bookings',
    package: 'package_bookings'
  };

  const table = tableMap[type];
  if (!table) {
    return res.status(400).json({ success: false, message: 'Invalid booking type' });
  }

  const query = `SELECT * FROM ${table} WHERE id = ? AND user_id = ?`;

  db.get(query, [bookingId, userId], (err, row) => {
    if (err) return res.status(500).json({ success: false, message: 'Error fetching booking', error: err.message });

    if (!row) return res.status(404).json({ success: false, message: 'Booking not found' });

    res.json({ success: true, booking: row });
  });
};

// ❌ Cancel Booking
exports.cancelBooking = (req, res) => {
  const userId = req.user.id;
  const { type, bookingId } = req.params;

  const tableMap = {
    flight: 'flight_bookings',
    hotel: 'hotel_bookings',
    package: 'package_bookings'
  };

  const table = tableMap[type];
  if (!table) {
    return res.status(400).json({ success: false, message: 'Invalid booking type' });
  }

  const query = `UPDATE ${table} SET status = 'cancelled' WHERE id = ? AND user_id = ?`;

  db.run(query, [bookingId, userId], function (err) {
    if (err) return res.status(500).json({ success: false, message: 'Failed to cancel booking', error: err.message });

    if (this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Booking not found or already cancelled' });
    }

    res.json({ success: true, message: 'Booking cancelled successfully' });
  });
};
