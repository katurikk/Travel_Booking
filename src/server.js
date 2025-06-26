require('dotenv').config()
const app = require('./src/app');
const db = require('./src/config/database');

// Optional test query
db.get('SELECT 1', (err) => {
  if (err) {
    console.error('❌ DB Test Query Failed:', err.message);
  } else {
    console.log('🔁 Ran test query on DB');
  }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
