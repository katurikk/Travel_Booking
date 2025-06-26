const db = require('../config/database');
const crypto = require('crypto');

// Utility function to generate a unique booking reference
function generateBookingRef() {
  return 'FB-' + crypto.randomBytes(4).toString('hex').toUpperCase();
}

exports.bookFlight = (req, res) => {
  const {
    userId,
    flightId,
    journeyDate,
    travelClass,
    seats = 1,
    contactEmail,
    contactPhone
  } = req.body;

  if (!userId || !flightId || !journeyDate || !travelClass || !contactEmail || !contactPhone) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const flightQuery = `SELECT base_price, available_seats FROM flights WHERE id = ?`;

  db.get(flightQuery, [flightId], (err, flight) => {
    if (err || !flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    if (flight.available_seats < seats) {
      return res.status(400).json({ success: false, message: 'Insufficient seats available' });
    }

    const totalAmount = flight.base_price * seats;
    const bookingRef = generateBookingRef();

    const insertQuery = `
      INSERT INTO flight_bookings 
      (user_id, flight_id, booking_reference, journey_date, travel_class, total_amount, contact_email, contact_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [userId, flightId, bookingRef, journeyDate, travelClass, totalAmount, contactEmail, contactPhone], function (err2) {
      if (err2) {
        return res.status(500).json({ success: false, message: 'Failed to create booking', error: err2.message });
      }

      const updateSeatsQuery = `
        UPDATE flights SET available_seats = available_seats - ? WHERE id = ?
      `;

      db.run(updateSeatsQuery, [seats, flightId], (err3) => {
        if (err3) {
          return res.status(500).json({ success: false, message: 'Failed to update flight seats', error: err3.message });
        }

        res.status(201).json({
          success: true,
          message: 'Booking successful',
          bookingId: this.lastID,
          bookingReference: bookingRef,
          totalAmount
        });
      });
    });
  });
};
