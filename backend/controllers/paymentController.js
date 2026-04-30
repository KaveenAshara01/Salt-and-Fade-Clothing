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
      paymentResult: {
        id: invoiceId, // Store invoiceId here temporarily so webhook can find it!
      }
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
    // The webhook URL where PAYable will POST the secure status
    const notifyUrl = `${process.env.BACKEND_URL || frontendUrl}/api/payment/notify`;

    const paymentParams = {
      logoUrl:
        'https://ipgpublic-mer-logo.s3.ap-southeast-1.amazonaws.com/live/Salt_and_Fade_Clothing_916385a5-c084-472b-b8f1-56fe744ae379.png',
      returnUrl,
      notifyUrl,
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

// @desc    Check order status from DB (frontend polls this on return page)
// @route   POST /api/payment/confirm
// @access  Public
const confirmPayment = async (req, res) => {
  try {
    const { orderId } = req.body;
    const order = await Order.findById(orderId);
    
    if (!order) {
      return res.status(404).json({ message: 'Order not found.' });
    }

    if (order.isPaid) {
      return res.status(200).json({ success: true, order });
    } else if (order.status === 'Payment Failed') {
      return res.status(200).json({ success: false, message: 'Payment failed.', order });
    } else {
      // Still pending webhook
      return res.status(200).json({ success: 'pending', order });
    }
  } catch (error) {
    console.error('confirmPayment error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Handle server-to-server webhook from PAYable
// @route   POST /api/payment/notify
// @access  Public
const handleNotify = async (req, res) => {
  try {
    const {
      merchantKey,
      payableOrderId,
      payableTransactionId,
      payableAmount,
      payableCurrency,
      invoiceNo,
      statusCode,
      statusMessage,
      checkValue,
    } = req.body;

    require('fs').appendFileSync('payable-webhook.log', JSON.stringify({ timestamp: new Date(), body: req.body }) + '\\n');

    // 1. Verify Hash
    const hashedToken = crypto.createHash('sha512').update(MERCHANT_TOKEN).digest('hex').toUpperCase();
    const dataString = `${merchantKey}|${payableOrderId}|${payableTransactionId}|${payableAmount}|${payableCurrency}|${invoiceNo}|${statusCode}|${hashedToken}`;
    const generatedCheckValue = crypto.createHash('sha512').update(dataString).digest('hex').toUpperCase();

    if (generatedCheckValue !== checkValue) {
      console.error('PAYable Webhook CheckValue Mismatch!');
      return res.status(400).json({ error: 'Invalid hash' });
    }

    // 2. Find Order by invoiceId (we saved invoiceId in order creation, wait we didn't save it to DB! Let's find by orderNumber or just ID? Oh we didn't save invoiceId to DB! Wait!)
    // Actually, we generated invoiceNo as `INV${Date.now()}` but we didn't save it. We only returned it to frontend.
    // Let's modify initiatePayment to save invoiceId to `paymentResult.id` so we can find it!
    // Or we can extract the original order. Wait! 
    const order = await Order.findOne({ 'paymentResult.id': invoiceNo });
    
    if (!order) {
       // fallback: find by invoiceNo string matching if needed, or if we modify initiatePayment below.
       // Let's just respond 200 so PAYable stops retrying if order not found.
       return res.status(200).json({ Status: 200 });
    }

    if (order.isPaid) {
      return res.status(200).json({ Status: 200 });
    }

    if (String(statusCode) === '1') {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.status = 'Processing';
      order.paymentResult = {
        id: payableTransactionId,
        status: 'APPROVED',
        update_time: new Date().toISOString(),
        email_address: '',
      };

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
    } else {
      order.status = 'Payment Failed';
    }

    await order.save();
    return res.status(200).json({ Status: 200 });

  } catch (error) {
    console.error('PAYable Webhook Error:', error);
    return res.status(500).json({ error: error.message });
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

module.exports = { initiatePayment, confirmPayment, getOrderById, handleNotify };
