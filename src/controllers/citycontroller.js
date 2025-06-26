// src/controllers/cityController.js
const db = require('../config/database');

exports.getCities = (req, res) => {
  const query = `SELECT DISTINCT city FROM hotels`;

  db.all(query, [], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch cities', error: err.message });
    }

    res.json({ success: true, cities: rows.map(row => row.city) });
  });
};
