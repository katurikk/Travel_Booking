const fs = require('fs');
const path = require('path');
const db = require('./src/config/database'); // adjust if needed

const seedFilePath = path.join(__dirname, 'database', 'seeds.sql');
const seedSQL = fs.readFileSync(seedFilePath, 'utf8');

db.exec(seedSQL, (err) => {
  if (err) {
    console.error('❌ Failed to seed database:', err.message);
  } else {
    console.log('✅ Seed data inserted successfully!');
  }
});
