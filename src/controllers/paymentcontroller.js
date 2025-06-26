// src/controllers/paymentController.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// 🟡 Initiate Payment
exports.initiatePayment = (req, res) => {
  const { bookingType, bookingId, paymentMethod } = req.body;

  if (!bookingType || !bookingId || !paymentMethod) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  // Determine which table to fetch price from
  let bookingTable;
  if (bookingType === 'flight') bookingTable = 'flight_bookings';
  else if (bookingType === 'hotel') bookingTable = 'hotel_bookings';
  else if (bookingType === 'package') bookingTable = 'package_bookings';
  else return res.status(400).json({ success: false, message: 'Invalid booking type' });

  const query = `SELECT total_cost FROM ${bookingTable} WHERE id = ?`;

  db.get(query, [bookingId], (err, booking) => {
    if (err || !booking) {
      return res.status(404).json({ success: false, message: 'Booking not found' });
    }

    const transactionId = 'TXN-' + uuidv4().split('-')[0].toUpperCase();
    const amount = booking.total_cost;

    const insertQuery = `
      INSERT INTO payments (transaction_id, booking_type, booking_id, payment_method, amount, status)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
      transactionId,
      bookingType,
      bookingId,
      paymentMethod,
      amount,
      'initiated'
    ], function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Failed to initiate payment', error: err.message });
      }

      res.json({
        success: true,
        transactionId,
        amount,
        paymentUrl: `https://mockpay.io/process/${transactionId}` // mock link
      });
    });
  });
};

// 🟢 Confirm Payment
exports.confirmPayment = (req, res) => {
  const { transactionId } = req.body;

  if (!transactionId) {
    return res.status(400).json({ success: false, message: 'Transaction ID is required' });
  }

  const query = `UPDATE payments SET status = 'confirmed' WHERE transaction_id = ?`;

  db.run(query, [transactionId], function (err) {
    if (err || this.changes === 0) {
      return res.status(404).json({ success: false, message: 'Payment not found or already confirmed' });
    }

    res.json({
      success: true,
      message: 'Payment confirmed successfully',
      transactionId
    });
  });
};
