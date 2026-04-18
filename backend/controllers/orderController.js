const Order = require('../models/Order.js');
const Product = require('../models/Product.js');
const User = require('../models/User.js');
const nodemailer = require('nodemailer');
const path = require('path');
const jwt = require('jsonwebtoken');

// Helper for sending emails
const sendOrderEmail = async (order, type = 'buyer') => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const isBuyer = type === 'buyer';
    const recipient = isBuyer ? order.shippingAddress.email : process.env.ADMIN_EMAIL;
    const subject = isBuyer
      ? `Salt & Fade - Order Confirmation #${order.orderNumber}`
      : `NEW ORDER ALERT - Order #${order.orderNumber}`;


    const logoUrl = 'https://res.cloudinary.com/kaveen/image/upload/v1775236706/logo-transparent_mj4nci.png';

    const itemsHtml = order.orderItems
      .map(
        (item) => `
      <tr>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.name} (${item.size})</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">${item.qty}</td>
        <td style="padding: 10px; border-bottom: 1px solid #eee;">Rs. ${item.price.toLocaleString()}</td>
      </tr>
    `
      )
      .join('');

    const html = `
      <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: auto; border: 1px solid #f0f0f0; padding: 40px; color: #333; line-height: 1.6;">
        
        <!-- Logo Section -->
        <div style="text-align: center; margin-bottom: 40px;">
           <img src="${logoUrl}" alt="Salt & Fade" style="max-width: 160px; height: auto;" />
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
           ${isBuyer
        ? `<h2 style="color: #111; font-size: 1.6rem; margin-bottom: 15px; letter-spacing: 1px;">THANK YOU FOR YOUR ORDER!</h2>
                <p style="color: #333; font-size: 1.1rem; font-weight: 500; margin-bottom: 5px;">We really appreciate your support.</p>
                <p style="color: #666; font-size: 0.95rem; line-height: 1.6;">Your Salt & Fade order is confirmed and will be packed with care. <br/>Enjoy repping the vibe — Clean. Chill. Original.</p>`
        : `<h2 style="color: #111; font-size: 1.6rem; margin-bottom: 10px;">NEW ORDER RECEIVED</h2>
                <p style="color: #666; font-size: 1rem;">Order #${order.orderNumber} has been placed by ${order.shippingAddress.firstName} ${order.shippingAddress.lastName}.</p>`
      }
        </div>

        <div style="background-color: #fafafa; padding: 25px; border-radius: 8px; margin-bottom: 30px;">
           <p style="margin: 5px 0;">Order Number: <strong>#${order.orderNumber}</strong></p>
           <p style="margin: 5px 0;">Date: <strong>${new Date(order.createdAt).toLocaleDateString()}</strong></p>
           <p style="margin: 5px 0;">Status: <strong style="color: #111;">Processing</strong></p>
        </div>

        <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
          <thead>
            <tr style="border-bottom: 2px solid #111;">
              <th style="padding: 10px 0; text-align: left; font-size: 13px; text-transform: uppercase;">Product</th>
              <th style="padding: 10px 0; text-align: center; font-size: 13px; text-transform: uppercase;">Qty</th>
              <th style="padding: 10px 0; text-align: right; font-size: 13px; text-transform: uppercase;">Price</th>
            </tr>
          </thead>
          <tbody>
            ${itemsHtml}
          </tbody>
        </table>
        
        <div style="border-top: 2px solid #f0f0f0; padding-top: 20px; margin-bottom: 30px;">
           <div style="display: flex; justify-content: flex-end; margin-bottom: 8px;">
              <div style="text-align: right; font-size: 14px; color: #777; width: 100%;">
                 Subtotal: Rs. ${order.itemsPrice.toLocaleString()}
              </div>
           </div>
           <div style="display: flex; justify-content: flex-end; margin-bottom: 12px;">
              <div style="text-align: right; font-size: 14px; color: #777; width: 100%;">
                 Delivery Charge: Rs. ${order.shippingPrice.toLocaleString()}
              </div>
           </div>
           <div style="display: flex; justify-content: flex-end;">
              <div style="text-align: right; font-size: 20px; font-weight: 800; color: #111; width: 100%;">
                 TOTAL: Rs. ${order.totalPrice.toLocaleString()} LKR
              </div>
           </div>
        </div>
        
        <div style="margin-top: 40px; padding: 25px; border: 1px dashed #ddd; border-radius: 8px;">
           <h4 style="margin: 0 0 10px; font-size: 14px; text-transform: uppercase; color: #999;">Shipping Address</h4>
           <p style="margin: 0; font-weight: 600;">${order.shippingAddress.firstName} ${order.shippingAddress.lastName}</p>
           <p style="margin: 5px 0;">${order.shippingAddress.address}, ${order.shippingAddress.city}</p>
           <p style="margin: 5px 0; font-size: 13px; color: #777;">Payment: ${order.paymentMethod}</p>
        </div>
        
        ${isBuyer
        ? `<div style="margin-top: 40px; text-align: center; font-size: 0.9rem; color: #444; border-top: 1px solid #eee; padding-top: 30px;">
               <p style="margin-bottom: 10px; font-weight: 600;">🚚 You’ll receive your delivery within 2–4 working days.</p>
               <p style="color: #777;">We’ll share tracking details via email once it’s on the way.</p>
               <p style="margin-top: 25px; font-size: 0.8rem; color: #aaa;">&copy; 2026 Salt & Fade Clothing. All rights reserved.</p>
             </div>`
        : ''}
      </div>
    `;

    await transporter.sendMail({
      from: `"Salt & Fade" <${process.env.EMAIL_USER}>`,
      to: recipient,
      subject: subject,
      html: html,
    });

    console.log(`Email sent to ${recipient} (${type})`);
  } catch (error) {
    console.error('Email sending failed:', error);
  }
};

// Helper for sending shipping updates
const sendShippingEmail = async (order) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const logoUrl = 'https://res.cloudinary.com/kaveen/image/upload/v1775236706/logo-transparent_mj4nci.png';

    const html = `
      <div style="font-family: 'Inter', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; color: #333; background-color: #ffffff; border: 1px solid #eee; border-radius: 12px;">
        <div style="text-align: center; margin-bottom: 40px;">
           <img src="${logoUrl}" alt="Salt & Fade" style="max-width: 160px; height: auto;" />
        </div>

        <div style="text-align: center; margin-bottom: 30px;">
           <h2 style="color: #111; font-size: 1.6rem; margin-bottom: 15px; letter-spacing: 1px;">YOUR ORDER IS ON THE WAY!</h2>
           <p style="color: #666; font-size: 1rem; line-height: 1.6;">Order #${order.orderNumber} has been shipped and is heading to you.</p>
        </div>

        <div style="background-color: #f9f9f9; padding: 30px; border-radius: 8px; text-align: center; margin-bottom: 30px;">
          <p style="text-transform: uppercase; font-size: 12px; color: #999; margin-bottom: 8px; letter-spacing: 1px;">Tracking Number</p>
          <h3 style="font-size: 24px; color: #111; margin: 0; letter-spacing: 2px;">${order.trackingId}</h3>
          <p style="margin-top: 15px; font-size: 0.9rem; color: #666;">You can use this ID to track your delivery status with our partner courier.</p>
          <a href="https://domex.lk/Order-Details.php?wbno=${order.trackingId}" style="display: inline-block; margin-top: 20px; background-color: #111; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; letter-spacing: 1px;">Track Your Order</a>
        </div>

        <div style="margin-top: 40px; text-align: center; font-size: 0.9rem; color: #444; border-top: 1px solid #eee; padding-top: 30px;">
           <p style="margin-bottom: 10px; font-weight: 600;">🚚 Estimated arrival: 2–4 working days.</p>
           <p style="margin-top: 25px; font-size: 0.8rem; color: #aaa;">&copy; 2026 Salt & Fade Clothing. All rights reserved.</p>
        </div>
      </div>
    `;

    await transporter.sendMail({
      from: `"Salt & Fade" <${process.env.EMAIL_USER}>`,
      to: order.shippingAddress.email,
      subject: `Your Salt & Fade Order Shipped! (#${order.orderNumber})`,
      html: html,
    });

    console.log(`Shipping email sent for order #${order.orderNumber}`);
  } catch (error) {
    console.error('Shipping email failed:', error);
  }
};

// @desc    Create new order
// @route   POST /api/orders
// @access  Public (Handles Guest & Registered)
const addOrderItems = async (req, res) => {
  try {
    // 0. Manual Auth Check (since we removed the middleware wrapper)
    let authenticatedUser = null;
    const auth = req.headers.authorization;
    if (auth && auth.startsWith('Bearer')) {
      try {
        const token = auth.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallbacksecret');
        authenticatedUser = await User.findById(decoded.id).select('-password');
      } catch (error) {
        console.error('Optional auth failed in addOrderItems:', error.message);
        // We continue as guest if token is invalid
      }
    }

    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      res.status(400).json({ message: 'No order items' });
      return;
    }

    // 0.5. Pre-flight Stock Validation Loop
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" not found.` });
      }
      
      const availableStock = product.countInStock ? product.countInStock[item.size] : 0;
      
      if (typeof availableStock !== 'number' || availableStock < item.qty) {
        if (availableStock <= 0) {
           return res.status(400).json({ 
             message: `Sorry! "${item.name}" (Size: ${item.size}) is currently out of stock.` 
           });
        } else {
           return res.status(400).json({ 
             message: `Sorry! We only have ${availableStock} units of "${item.name}" (Size: ${item.size}) left in stock.` 
           });
        }
      }
    }

    // 1. Generate sequential order number
    const orderCount = await Order.countDocuments();
    const orderNumber = (orderCount + 1).toString().padStart(4, '0');

    // 2. Create Order
    const order = new Order({
      orderItems,
      user: authenticatedUser ? authenticatedUser._id : null, // Correctly link to user
      orderNumber,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      taxPrice,
      shippingPrice,
      totalPrice,
      isPaid: paymentMethod === 'Card Payment', // Simulate success for card
      paidAt: paymentMethod === 'Card Payment' ? Date.now() : null,
    });

    const createdOrder = await order.save();

    // 3. Reduce stock for each item
    for (const item of orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock[item.size] = Math.max(0, product.countInStock[item.size] - item.qty);
        await product.save();
      }
    }

    // 4. Clear user cart in DB if logged in
    if (req.user) {
      const user = await User.findById(req.user._id);
      if (user) {
        user.cart = [];
        await user.save();
      }
    }

    // 5. Send Emails (Async - don't block response)
    sendOrderEmail(createdOrder, 'buyer');
    sendOrderEmail(createdOrder, 'admin');

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get logged in user orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all orders
// @route   GET /api/orders
// @access  Private/Admin
const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update order status / tracking
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      const oldTracking = order.trackingId;
      order.status = req.body.status || order.status;
      order.trackingId = req.body.trackingId || order.trackingId;

      if (req.body.status === 'Delivered') {
        order.isDelivered = true;
        order.deliveredAt = Date.now();
      }

      const updatedOrder = await order.save();

      // Trigger email ONLY if trackingId was added/changed now
      if (req.body.trackingId && req.body.trackingId !== oldTracking) {
         sendShippingEmail(updatedOrder);
      }

      res.json(updatedOrder);
    } else {
      res.status(404).json({ message: 'Order not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Validate cart against live stock
// @route   POST /api/orders/validate-cart
// @access  Public
const validateCart = async (req, res) => {
  try {
    const { cartItems } = req.body;
    
    if (!cartItems || cartItems.length === 0) {
      return res.status(400).json({ message: 'No items in cart' });
    }

    for (const item of cartItems) {
      const product = await Product.findById(item.product);
      if (!product) {
        return res.status(404).json({ message: `Product "${item.name}" not found.` });
      }
      
      const availableStock = product.countInStock ? product.countInStock[item.size] : 0;
      
      if (typeof availableStock !== 'number' || availableStock < item.qty) {
        if (availableStock <= 0) {
           return res.status(400).json({ 
             message: `Sorry! "${item.name}" (Size: ${item.size}) is currently out of stock.` 
           });
        } else {
           return res.status(400).json({ 
             message: `Sorry! We only have ${availableStock} units of "${item.name}" (Size: ${item.size}) left in stock.` 
           });
        }
      }
    }

    res.status(200).json({ message: 'Cart valid' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addOrderItems,
  getMyOrders,
  getOrders,
  updateOrderStatus,
  validateCart,
};
