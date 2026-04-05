const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Import Routes
const userRoutes = require('./routes/userRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const collectionRoutes = require('./routes/collectionRoutes');
const uploadRoutes = require('./routes/uploadRoutes');

// Use Routes
app.use('/api/users', userRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/collections', collectionRoutes);
app.use('/api/upload', uploadRoutes);

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

  app.get('*', (req, res) => {
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
    console.error('\n❌ Error connecting to MongoDB:', err.message);
    process.exit(1);
  });
