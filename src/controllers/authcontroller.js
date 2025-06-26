const db = require('../config/database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();
// 🔐 Register User
exports.register = (req, res) => {
  const {
    first_name,
    last_name,
    email,
    password,
    phone,
    date_of_birth,
    passport_number = null
  } = req.body;

  if (!first_name || !last_name || !email || !password || !phone || !date_of_birth) {
    return res.status(400).json({
      success: false,
      message: 'Missing required fields'
    });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  const query = `
    INSERT INTO users 
    (first_name, last_name, email, password, phone, date_of_birth, passport_number) 
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  db.run(query, [
    first_name,
    last_name,
    email,
    hashedPassword,
    phone,
    date_of_birth,
    passport_number
  ], function (err) {
    if (err) {
      return res.status(500).json({ success: false, message: 'Registration failed', error: err.message });
    }

    res.json({ success: true, userId: this.lastID, message: 'User registered successfully' });
  });
};

// 🔑 Login User
exports.login = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  const query = `SELECT * FROM users WHERE email = ?`;

  db.get(query, [email], (err, user) => {
    if (err || !user) {
      return res.status(400).json({ success: false, message: 'Invalid email or user not found' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

    const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '2h' });

    res.json({ success: true, message: 'Login successful', token });
  });
};
