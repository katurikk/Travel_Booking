const express = require('express');
const cors = require('cors');
const app = express();

const db = require('./config/database');

// Middlewares
app.use(cors());
app.use(express.json());

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);
const flightRoutes = require('./routes/flightRoutes');
app.use('/api/flights', flightRoutes);
const flightBookingRoutes = require('./routes/flightbookingRoutes');
app.use('/api/flight-bookings', flightBookingRoutes);
const hotelRoutes = require('./routes/hotelRoutes');
app.use('/api/hotels', hotelRoutes);
const userRoutes = require('./routes/userRoutes'); 
app.use('/api/users', userRoutes);
const bookingRoutes = require('./routes/bookingRoutes');
app.use('/api/bookings', bookingRoutes);
const packageRoutes = require('./routes/packageRoutes');
app.use('/api/packages', packageRoutes);
const paymentRoutes = require('./routes/paymentRoutes');
app.use('/api/payments', paymentRoutes);
const airportRoutes = require('./routes/airportRoutes');
app.use('/api/airports', airportRoutes);
const cityRoutes = require('./routes/cityRoutes');
app.use('/api/cities', cityRoutes);


// Health check route
app.get('/', (req, res) => {
  res.send('🌍 Travel Booking API is running');
});

// Import & use route files (we’ll create soon)
// app.use('/api/auth', require('./routes/authRoutes'));

module.exports = app;
