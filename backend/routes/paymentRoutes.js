const express = require('express');
const router = express.Router();
const {
  initiatePayment,
  confirmPayment,
  getOrderById,
  handleNotify,
} = require('../controllers/paymentController');

// POST /api/payment/initiate — create pending order + return PAYable params
router.post('/initiate', initiatePayment);

// POST /api/payment/confirm — called by frontend return page to mark order paid
router.post('/confirm', confirmPayment);

// POST /api/payment/notify - PAYable Webhook
router.post('/notify', handleNotify);

// GET /api/payment/order/:id — fetch order for return page display
router.get('/order/:id', getOrderById);

module.exports = router;
