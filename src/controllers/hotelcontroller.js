const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// ----------------------------
// 🔍 Hotel Search
// ----------------------------
exports.searchHotels = (req, res) => {
  const { city, checkIn, checkOut } = req.query;

  if (!city || !checkIn || !checkOut) {
    return res.status(400).json({
      success: false,
      message: 'Missing required query parameters (city, checkIn, checkOut)'
    });
  }

  const query = `
    SELECT 
      h.id AS hotelId,
      h.name AS hotelName,
      h.city,
      h.star_rating,
      h.amenities,
      r.id AS roomId,
      r.room_type,
      r.price_per_night,
      r.max_occupancy,
      r.available_rooms,
      r.amenities AS roomAmenities
    FROM hotels h
    JOIN hotel_rooms r ON h.id = r.hotel_id
    WHERE h.city = ?
  `;

  db.all(query, [city], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB error', error: err.message });
    }

    const hotels = rows.map(row => ({
      hotelId: row.hotelId,
      hotelName: row.hotelName,
      city: row.city,
      starRating: row.star_rating,
      hotelAmenities: JSON.parse(row.amenities),
      roomId: row.roomId,
      roomType: row.room_type,
      pricePerNight: row.price_per_night,
      maxOccupancy: row.max_occupancy,
      availableRooms: row.available_rooms,
      roomAmenities: JSON.parse(row.roomAmenities),
    }));

    res.json({
      success: true,
      totalResults: hotels.length,
      checkIn,
      checkOut,
      hotels
    });
  });
};

// ----------------------------
// 🏨 Hotel Booking
// ----------------------------
exports.bookHotelRoom = (req, res) => {
  const {
    user_id,
    hotel_id,
    room_id,
    check_in,
    check_out,
    rooms,
    special_requests = ''
  } = req.body;

  // ✅ Validate required fields
  if (!user_id || !hotel_id || !room_id || !check_in || !check_out || !rooms) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // ✅ Query room price
  const priceQuery = `SELECT price_per_night FROM hotel_rooms WHERE id = ?`;

  db.get(priceQuery, [room_id], (err, room) => {
    if (err || !room) {
      return res.status(500).json({ success: false, message: 'Room not found or DB error', error: err?.message });
    }

    const nights = Math.ceil(
      (new Date(check_out) - new Date(check_in)) / (1000 * 60 * 60 * 24)
    );

    if (nights <= 0) {
      return res.status(400).json({ success: false, message: 'Invalid check-in/check-out dates' });
    }

    const totalAmount = room.price_per_night * nights * rooms;
    const bookingRef = 'HB-' + uuidv4().split('-')[0].toUpperCase();

    // ✅ Insert booking
    const insertQuery = `
      INSERT INTO hotel_bookings 
      (user_id, hotel_id, room_id, booking_reference, check_in, check_out, rooms, total_amount, special_requests) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
      user_id,
      hotel_id,
      room_id,
      bookingRef,
      check_in,
      check_out,
      rooms,
      totalAmount,
      special_requests
    ], function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to book hotel', error: err.message });
      }

      res.json({
        success: true,
        message: 'Hotel booking successful',
        bookingId: this.lastID,
        bookingReference: bookingRef,
        totalAmount
      });
    });
  });
};
