const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const sharp = require('sharp');
const { bucket } = require('../config/firebase');
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Order = require('../models/Order');

async function downloadAndProcessImage(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${url}: ${response.statusText}`);
    const arrayBuffer = await response.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    
    // Convert to webp
    const processedBuffer = await sharp(buffer)
      .webp({ quality: 80 })
      .toBuffer();
    
    return processedBuffer;
  } catch (error) {
    console.error(`Error processing image ${url}:`, error);
    return null;
  }
}

async function uploadToFirebase(buffer, originalUrl) {
  try {
    // Extract a filename from Cloudinary URL or generate a new one
    // Cloudinary format is usually .../upload/v1234/folder/file.jpg
    const urlParts = originalUrl.split('/');
    const filenameWithExt = urlParts[urlParts.length - 1];
    const filename = filenameWithExt.split('.')[0];
    
    // Create a path in Firebase
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const firebasePath = `migrated/${uniqueSuffix}-${filename}.webp`;

    const file = bucket.file(firebasePath);

    await file.save(buffer, {
      metadata: { contentType: 'image/webp' },
      resumable: false,
    });

    await file.makePublic();
    
    return {
      url: `https://storage.googleapis.com/${bucket.name}/${firebasePath}`,
      public_id: firebasePath
    };
  } catch (error) {
    console.error(`Error uploading to Firebase for ${originalUrl}:`, error);
    return null;
  }
}

async function processUrl(url) {
  if (!url || !url.includes('cloudinary.com')) return null;
  
  console.log(`Processing: ${url}`);
  const buffer = await downloadAndProcessImage(url);
  if (!buffer) return null;
  
  const uploaded = await uploadToFirebase(buffer, url);
  if (uploaded) {
    console.log(`Migrated to: ${uploaded.url}`);
  }
  return uploaded;
}

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    // 1. Migrate Collections
    const collections = await Collection.find({});
    for (const col of collections) {
      if (col.image && col.image.includes('cloudinary.com')) {
        const uploaded = await processUrl(col.image);
        if (uploaded) {
          col.image = uploaded.url;
          col.public_id = uploaded.public_id;
          await col.save();
        }
      }
    }
    console.log('Collections migration completed.');

    // 2. Migrate Products
    const products = await Product.find({});
    for (const prod of products) {
      let updated = false;
      
      // Main images
      for (let i = 0; i < prod.images.length; i++) {
        if (prod.images[i].url.includes('cloudinary.com')) {
          const uploaded = await processUrl(prod.images[i].url);
          if (uploaded) {
            prod.images[i].url = uploaded.url;
            prod.images[i].public_id = uploaded.public_id;
            updated = true;
          }
        }
      }

      // Size chart
      if (prod.sizeChart && prod.sizeChart.url && prod.sizeChart.url.includes('cloudinary.com')) {
        const uploaded = await processUrl(prod.sizeChart.url);
        if (uploaded) {
          prod.sizeChart.url = uploaded.url;
          prod.sizeChart.public_id = uploaded.public_id;
          updated = true;
        }
      }

      if (updated) {
        await prod.save();
      }
    }
    console.log('Products migration completed.');

    // 3. Migrate Users (Cart Images)
    const users = await User.find({});
    for (const user of users) {
      let updated = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].image && user.cart[i].image.includes('cloudinary.com')) {
          const uploaded = await processUrl(user.cart[i].image);
          if (uploaded) {
            user.cart[i].image = uploaded.url;
            updated = true;
          }
        }
      }
      if (updated) {
        await user.save();
      }
    }
    console.log('Users (Cart) migration completed.');

    // 4. Migrate Orders (Order Items Images)
    const orders = await Order.find({});
    for (const order of orders) {
      let updated = false;
      for (let i = 0; i < order.orderItems.length; i++) {
        if (order.orderItems[i].image && order.orderItems[i].image.includes('cloudinary.com')) {
          const uploaded = await processUrl(order.orderItems[i].image);
          if (uploaded) {
            order.orderItems[i].image = uploaded.url;
            updated = true;
          }
        }
      }
      if (updated) {
        await order.save();
      }
    }
    console.log('Orders migration completed.');

    console.log('Migration Finished Successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
