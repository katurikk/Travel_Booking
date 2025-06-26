// src/controllers/airportController.js
const db = require('../config/database');

exports.getAirports = (req, res) => {
  const { search = '' } = req.query;

  const query = `
    SELECT code, name, city, country
    FROM airports
    WHERE name LIKE ? OR city LIKE ?
  `;

  const keyword = `%${search}%`;

  db.all(query, [keyword, keyword], (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'Failed to fetch airports', error: err.message });
    }

    res.json({ success: true, airports: rows });
  });
};
