// src/routes/paymentRoutes.js
const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentcontroller');

router.post('/initiate', paymentController.initiatePayment);
router.post('/confirm', paymentController.confirmPayment);

module.exports = router;
