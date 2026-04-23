const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

console.log('\n=======================================');
console.log('🚀 Starting Salt & Fade Server...');
console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
console.log(`📦 DB URI Detected: ${process.env.MONGO_URI ? 'YES' : 'NO (Using Local Default)'}`);
console.log(`🔐 JWT Secret Detected: ${process.env.JWT_SECRET ? 'YES' : 'NO (Check ENV)'}`);
console.log(`💳 PAYable MerchantID: ${process.env.PAYABLE_MERCHANT_ID ? 'YES' : 'NO (Check ENV)'}`);
console.log(`💳 PAYable Token: ${process.env.PAYABLE_MERCHANT_TOKEN ? 'YES' : 'NO (Check ENV)'}`);
console.log('=======================================\n');

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/payment', paymentRoutes);

// Error Handling Middleware
app.use((err, req, res, next) => {
  const statusCode = res.statusCode === 200 ? 500 : res.statusCode;
  res.status(statusCode).json({
    message: err.message,
    stack: process.env.NODE_ENV === 'production' ? null : err.stack,
  });
});

// Serve frontend in production
if (process.env.NODE_ENV === 'production') {
  const frontendPath = path.join(__dirname, '../frontend/dist');
  app.use(express.static(frontendPath));

  app.get('*path', (req, res) => {
    res.sendFile(path.resolve(frontendPath, 'index.html'));
  });
} else {
  app.get('/', (req, res) => {
    res.send('API is running...');
  });
}

const PORT = process.env.PORT || 5000;
const defaultMongoUri = 'mongodb://localhost:27017/salt-and-fade';

// Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI || defaultMongoUri)
  .then((conn) => {
    console.log('\n=======================================');
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    app.listen(PORT, () => {
      console.log(`🚀 Backend Server running on port ${PORT}`);
      console.log('=======================================\n');
    });
  })
  .catch((err) => {
    console.log('---------------------------------------');
    console.log('CRITICAL: Error connecting to MongoDB');
    console.log('Error Message:', err.message);
    console.log('Check your MONGO_URI in Render dashboard.');
    console.log('---------------------------------------');
    
    // Slight delay to allow logs to flush to Render
    setTimeout(() => {
      process.exit(1);
    }, 1000);
  });
