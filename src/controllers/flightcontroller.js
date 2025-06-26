const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// ✈️ Search Flights
exports.searchFlights = (req, res) => {
  const { from, to, departDate, tripType = 'oneway', adults = 1, class: travelClass = 'economy' } = req.query;

  const query = `
    SELECT 
      f.id AS flightId,
      f.flight_number,
      a.name AS airline,
      src.code AS from_code,
      dest.code AS to_code,
      f.departure_time AS departure,
      f.arrival_time AS arrival,
      f.base_price AS price,
      f.available_seats
    FROM flights f
    JOIN airlines a ON f.airline_id = a.id
    JOIN airports src ON f.source_airport_id = src.id
    JOIN airports dest ON f.destination_airport_id = dest.id
    WHERE src.code = ? AND dest.code = ? AND DATE(f.departure_time) = DATE(?)
  `;

  db.all(query, [from, to, departDate], (err, rows) => {
    if (err) {
      return res.status(500).json({
        success: false,
        message: 'Failed to fetch flights',
        error: err.message
      });
    }

    res.json({
      success: true,
      totalFlights: rows.length,
      flights: rows.map(flight => ({
        flightId: flight.flightId,
        flightNumber: flight.flight_number,
        airline: flight.airline,
        from: flight.from_code,
        to: flight.to_code,
        departure: flight.departure,
        arrival: flight.arrival,
        duration: '2h 30m', // Optional: static for now
        price: flight.price,
        availableSeats: flight.available_seats,
        class: travelClass
      }))
    });
  });
};

// 🧾 Book Flight
exports.bookFlight = (req, res) => {
  const {
    flightId,
    journeyDate,
    class: flightClass,
    passengers,
    contactDetails
  } = req.body;

  const userId = req.user.id;

  if (!flightId || !journeyDate || !passengers || !Array.isArray(passengers) || passengers.length === 0 || !contactDetails) {
    return res.status(400).json({ success: false, message: 'Missing or invalid booking details' });
  }

  const flightQuery = `SELECT * FROM flights WHERE id = ?`;

  db.get(flightQuery, [flightId], (err, flight) => {
    if (err || !flight) {
      return res.status(404).json({ success: false, message: 'Flight not found' });
    }

    if (flight.available_seats < passengers.length) {
      return res.status(409).json({ success: false, message: 'Not enough seats available' });
    }

    const basePrice = flight.base_price;
    const totalAmount = basePrice * passengers.length;

    const bookingRef = 'FL-' + uuidv4().split('-')[0].toUpperCase();

    const insertBookingQuery = `
      INSERT INTO flight_bookings (user_id, flight_id, booking_reference, journey_date, total_cost, contact_email, contact_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(
      insertBookingQuery,
      [userId, flightId, bookingRef, journeyDate, totalAmount, contactDetails.email, contactDetails.phone],
      function (err) {
        if (err) {
          return res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
        }

        const bookingId = this.lastID;

        const insertPassengerQuery = `
          INSERT INTO passengers (booking_id, first_name, last_name, date_of_birth, passport_number)
          VALUES (?, ?, ?, ?, ?)
        `;

        passengers.forEach((p) => {
          db.run(insertPassengerQuery, [
            bookingId,
            p.firstName,
            p.lastName,
            p.dateOfBirth,
            p.passportNumber || null
          ]);
        });

        const updateSeatsQuery = `UPDATE flights SET available_seats = ? WHERE id = ?`;
        const remainingSeats = flight.available_seats - passengers.length;

        db.run(updateSeatsQuery, [remainingSeats, flightId], (err) => {
          if (err) {
            return res.status(500).json({ success: false, message: 'Failed to update seat count' });
          }

          res.json({
            success: true,
            message: 'Flight booked successfully',
            bookingReference: bookingRef,
            totalAmount,
            bookingId
          });
        });
      }
    );
  });
};
