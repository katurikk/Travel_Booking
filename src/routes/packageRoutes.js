// src/routes/packageRoutes.js
const express = require('express');
const router = express.Router();
const packageController = require('../controllers/packagecontroller');
const auth = require('../middleware/auth');

router.get('/search', packageController.searchPackages);
router.get('/:id', packageController.getPackageById);
router.post('/book', auth, packageController.bookPackage);

module.exports = router;
