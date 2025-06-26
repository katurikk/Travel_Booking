// src/controllers/packageController.js
const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// 🔍 Search Packages
exports.searchPackages = (req, res) => {
  const { destination, duration, budget, startDate, travelers } = req.query;

  let query = `SELECT * FROM holiday_packages WHERE 1=1`;
  const params = [];

  if (destination) {
    query += ` AND destinations LIKE ?`;
    params.push(`%${destination}%`);
  }

  if (duration) {
    query += ` AND duration_days = ?`;
    params.push(duration);
  }

  if (budget) {
    query += ` AND price_per_person <= ?`;
    params.push(budget);
  }

  db.all(query, params, (err, rows) => {
    if (err) {
      return res.status(500).json({ success: false, message: 'DB error', error: err.message });
    }

    const packages = rows.map(pkg => ({
      packageId: pkg.id,
      name: pkg.name,
      duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`,
      destinations: JSON.parse(pkg.destinations),
      pricePerPerson: pkg.price_per_person,
      inclusions: JSON.parse(pkg.inclusions),
      highlights: JSON.parse(pkg.highlights),
      images: JSON.parse(pkg.images)
    }));

    res.json({ success: true, packages });
  });
};

// 📦 Get Package Details
exports.getPackageById = (req, res) => {
  const { id } = req.params;

  const query = `SELECT * FROM holiday_packages WHERE id = ?`;
  db.get(query, [id], (err, pkg) => {
    if (err || !pkg) {
      return res.status(404).json({ success: false, message: 'Package not found' });
    }

    res.json({
      success: true,
      package: {
        packageId: pkg.id,
        name: pkg.name,
        duration: `${pkg.duration_days} Days / ${pkg.duration_nights} Nights`,
        destinations: JSON.parse(pkg.destinations),
        pricePerPerson: pkg.price_per_person,
        inclusions: JSON.parse(pkg.inclusions),
        highlights: JSON.parse(pkg.highlights),
        images: JSON.parse(pkg.images)
      }
    });
  });
};

// ✈️ Book Package (Authenticated)
exports.bookPackage = (req, res) => {
  const userId = req.user.id;
  const {
    packageId,
    startDate,
    travelers,
    travelerDetails = [],
    contactEmail,
    contactPhone
  } = req.body;

  if (!packageId || !startDate || !travelers || !contactEmail || !contactPhone) {
    return res.status(400).json({ success: false, message: 'Missing required fields' });
  }

  const packageQuery = `SELECT * FROM holiday_packages WHERE id = ?`;
  db.get(packageQuery, [packageId], (err, pkg) => {
    if (err || !pkg) {
      return res.status(400).json({ success: false, message: 'Package not found', error: err?.message });
    }

    const totalCost = pkg.price_per_person * travelers;
    const bookingReference = 'PK-' + uuidv4().split('-')[0].toUpperCase();

    const insertQuery = `
      INSERT INTO package_bookings
      (user_id, package_id, booking_reference, start_date, travelers, total_cost, contact_email, contact_phone)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(insertQuery, [
      userId,
      packageId,
      bookingReference,
      startDate,
      travelers,
      totalCost,
      contactEmail,
      contactPhone
    ], function (err) {
      if (err) {
        return res.status(500).json({ success: false, message: 'Booking failed', error: err.message });
      }

      res.json({
        success: true,
        message: 'Package booked successfully',
        bookingId: this.lastID,
        bookingReference,
        totalCost
      });
    });
  });
};
