const express = require('express');
const router = express.Router();

router.get('/ping', (req, res) => {
  res.json({ success: true, message: 'API is working fine!' });
});

module.exports = router;
