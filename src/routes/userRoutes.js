const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');

router.get('/protected', authMiddleware, (req, res) => {
  res.json({
    success: true,
    message: 'Access granted to protected route!',
    user: req.user
  });
});

module.exports = router;
