const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = path.resolve(__dirname, '../../database/travel_booking.db');

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Error connecting to SQLite:', err.message);
  } else {
    console.log('✅ Connected to SQLite Database');
  }
});

db.serialize(() => {
  db.run("CREATE TABLE IF NOT EXISTS test_connection (id INTEGER)");
  console.log("🔁 Ran test query on DB");
});

module.exports = db;
