const fs = require('fs');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Path to your database file
const dbPath = path.resolve(__dirname, './database/travel_booking.db');

// Read schema.sql file
const schemaPath = path.resolve(__dirname, './database/schema.sql');
const schema = fs.readFileSync(schemaPath, 'utf8');

// Connect to database
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('❌ Failed to connect to database:', err.message);
    return;
  }
  console.log('✅ Connected to database');

  db.exec(schema, (err) => {
    if (err) {
      console.error('❌ Failed to apply schema:', err.message);
    } else {
      console.log('✅ Schema applied successfully!');
    }

    db.close();
  });
});
