const crypto = require('crypto');
const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const jwt = require('jsonwebtoken');

const MERCHANT_KEY = process.env.PAYABLE_MERCHANT_ID;
const MERCHANT_TOKEN = process.env.PAYABLE_MERCHANT_TOKEN;

// ── Helper: compute PAYable checkValue ────────────────────────────────────────
// Formula from PAYable README (line 97):
// UPPERCASE( SHA512[ merchantKey | invoiceId | amount | currencyCode | UPPERCASE( SHA512[ merchantToken ] ) ] )
const computeCheckValue = (invoiceId, amount, currencyCode = 'LKR') => {
  // Step 1: SHA512 of the merchant token, uppercased
  const hashedToken = crypto
    .createHash('sha512')
    .update(MERCHANT_TOKEN)
    .digest('hex')
    .toUpperCase();

  // Step 2: SHA512 of the pipe-joined string, uppercased
  const data = `${MERCHANT_KEY}|${invoiceId}|${amount}|${currencyCode}|${hashedToken}`;
  return crypto
    .createHash('sha512')
    .update(data)
    .digest('hex')
    .toUpperCase();
};

// ── Helper: format amount to exactly 2 decimal places (PAYable requirement) ──
const formatAmount = (num) => Number(num).toFixed(2);

// ── Helper: optional JWT auth (same pattern as orderController) ───────────────
const getAuthUser = async (req) => {
  const auth = req.headers.authorization;
  if (auth && auth.startsWith('Bearer')) {
    try {
      const token = auth.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
      return await User.findById(decoded.id).select('-password');
    } catch {
      return null;
    }
  }
  return null;
};

// @desc    Initiate a card payment — create pending order + return PAYable params
// @route   POST /api/payment/initiate
// @access  Public (Guest & Registered)
const initiatePayment = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      itemsPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (!orderItems || orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items provided.' });
    }

    if (!MERCHANT_KEY || !MERCHANT_TOKEN) {
      console.error('PAYable credentials missing in environment variables.');
      return res.status(500).json({ message: 'Payment gateway is not configured.' });
    }

    // 1. Optional auth
    const authenticatedUser = await getAuthUser(req);

    // 2. Stock validation (same as addOrderItems)
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" not found.` });
      }
      const availableStock = product.countInStock ? product.countInStock[item.size] : 0;
      if (typeof availableStock !== 'number' || availableStock < item.qty) {
        if (availableStock <= 0) {
          return res.status(400).json({
            message: `Sorry! "${item.name}" (Size: ${item.size}) is currently out of stock.`,
          });
        } else {
          return res.status(400).json({
            message: `Sorry! We only have ${availableStock} units of "${item.name}" (Size: ${item.size}) left.`,
          });
        }
      }
    }

    // 3. Generate sequential order number & invoiceId (PAYable max = 20 chars)
    const orderCount = await Order.countDocuments();
    const orderNumber = (orderCount + 1).toString().padStart(4, '0');
    // Use timestamp for uniqueness, e.g. "INV1714454045000" (16 chars)
    const invoiceId = `INV${Date.now()}`;

    // 4. Create PENDING order in DB (isPaid = false, status = 'Pending Payment')
    const order = new Order({
      orderItems,
      user: authenticatedUser ? authenticatedUser._id : null,
      orderNumber,
      shippingAddress,
      paymentMethod: 'Card Payment',
      itemsPrice,
      taxPrice: 0,
      shippingPrice,
      totalPrice,
      isPaid: false,
      status: 'Pending Payment',
    });

    const createdOrder = await order.save();

    // Removed immediate stock reduction here per user request. 
    // Stock will be reduced only after successful payment confirmation.

    // 6. Build PAYable payment params
    const amount = formatAmount(totalPrice);
    const currencyCode = 'LKR';
    const checkValue = computeCheckValue(invoiceId, amount, currencyCode);

    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    const returnUrl = `${frontendUrl}/payment/return`;

    const paymentParams = {
      logoUrl:
        'https://ipgpublic-mer-logo.s3.ap-southeast-1.amazonaws.com/live/Salt_and_Fade_Clothing_916385a5-c084-472b-b8f1-56fe744ae379.png',
      returnUrl,
      // refererUrl must also be https — we pass frontendUrl so it can be overridden
      // by the direct fetch helper on the frontend (bypasses the npm package auto-detect)
      refererUrl: frontendUrl,
      checkValue,
      // PAYable does not allow & or # in orderDescription
      orderDescription: `Salt and Fade Order ${orderNumber}`,
      invoiceId,
      merchantKey: MERCHANT_KEY,
      customerFirstName: shippingAddress.firstName,
      customerLastName: shippingAddress.lastName,
      customerMobilePhone: shippingAddress.phoneNumber,
      customerEmail: shippingAddress.email,
      billingAddressStreet: shippingAddress.address,
      billingAddressCity: shippingAddress.city,
      billingAddressCountry: 'LKA',
      billingAddressPostcodeZip: shippingAddress.postalCode || '0000',
      amount,
      currencyCode,
      paymentType: '1', // One-time payment
    };

    res.status(201).json({
      orderId: createdOrder._id,
      orderNumber: createdOrder.orderNumber,
      paymentParams,
    });
  } catch (error) {
    console.error('initiatePayment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Confirm card payment after PAYable redirect (called by frontend return page)
// @route   POST /api/payment/confirm
// @access  Public
const confirmPayment = async (req, res) => {
  try {
    const { orderId, invoiceId, status, transactionId, rawUrlParams } = req.body;

    // Log the exact payload received from frontend for debugging
    require('fs').appendFileSync('payable-debug.log', JSON.stringify({ timestamp: new Date(), body: req.body }) + '\\n');

    // PAYable might return different values for success. Let's loosen the check.
    // Accept '1', '2' (in case old versions use it), '00', 'SUCCESS', 'APPROVED'
    const statusStr = String(status).toUpperCase();
    const isSuccess = statusStr === '1' || statusStr === '2' || statusStr === '00' || statusStr === 'SUCCESS' || statusStr === 'APPROVED';

    if (!isSuccess) {
      // Payment failed or was cancelled — mark status accordingly
      await Order.findByIdAndUpdate(orderId, {
        status: 'Payment Failed',
        'paymentResult.status': String(status),
        'paymentResult.id': transactionId || '',
        'paymentResult.update_time': new Date().toISOString(),
      });
      return res.status(200).json({ success: false, message: 'Payment was not successful.' });
    }

    // Mark order as paid
    const order = await Order.findByIdAndUpdate(
      orderId,
      {
        isPaid: true,
        paidAt: Date.now(),
        status: 'Processing',
        paymentResult: {
          id: transactionId || invoiceId,
          status: 'APPROVED',
          update_time: new Date().toISOString(),
          email_address: '',
        },
      },
      { new: true }
    );

    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    // Reduce stock ONLY upon successful payment
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock[item.size] = Math.max(
          0,
          product.countInStock[item.size] - item.qty
        );
        await product.save();
      }
    }

    // Clear user cart if logged in
    if (order.user) {
      const user = await User.findById(order.user);
      if (user) {
        user.cart = [];
        await user.save();
      }
    }

    res.status(200).json({ success: true, order });
  } catch (error) {
    console.error('confirmPayment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get a single order by ID (used by return page to display order details)
// @route   GET /api/payment/order/:id
// @access  Public (return page needs this without auth)
const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { initiatePayment, confirmPayment, getOrderById };
