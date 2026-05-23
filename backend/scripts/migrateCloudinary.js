const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });
const mongoose = require('mongoose');
const cloudinary = require('cloudinary').v2;
const Product = require('../models/Product');
const Collection = require('../models/Collection');
const User = require('../models/User');
const Order = require('../models/Order');

// Configure for NEW Cloudinary first
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const oldPublicIdsToDelete = [];

async function uploadToNewCloudinary(oldUrl, oldPublicId) {
  try {
    if (!oldUrl || !oldUrl.includes('cloudinary.com')) return null;

    console.log(`Migrating: ${oldUrl}`);
    
    // Extract folder from old public_id
    // e.g., "salt-and-fade/collections/abc" -> folder: "salt-and-fade/collections", public_id: "abc"
    const parts = oldPublicId ? oldPublicId.split('/') : [];
    let folder = 'salt-and-fade/others';
    if (parts.length > 1) {
      parts.pop(); // remove filename
      folder = parts.join('/');
    }

    // Upload directly from the old URL
    const result = await cloudinary.uploader.upload(oldUrl, {
      folder: folder,
      format: 'webp',
      resource_type: 'image'
    });

    return {
      url: result.secure_url,
      public_id: result.public_id,
      old_public_id: oldPublicId
    };
  } catch (error) {
    console.error(`Failed to migrate ${oldUrl}:`, error);
    return null;
  }
}

async function processImageField(item, fieldPath1, fieldPath2) {
   // This is a helper, but since structures vary, we'll do it manually below
}

async function runMigration() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB Connected');

    console.log(`Using New Cloudinary: ${process.env.CLOUDINARY_CLOUD_NAME}`);

    // 1. Collections
    const collections = await Collection.find({});
    for (const col of collections) {
      if (col.image && col.image.includes('kaveen')) {
        const uploaded = await uploadToNewCloudinary(col.image, col.public_id);
        if (uploaded) {
          col.image = uploaded.url;
          col.public_id = uploaded.public_id;
          await col.save({ validateBeforeSave: false });
          if (uploaded.old_public_id) oldPublicIdsToDelete.push(uploaded.old_public_id);
        }
      }
    }
    console.log('Collections migration completed.');

    // 2. Products
    const products = await Product.find({});
    for (const prod of products) {
      let updated = false;
      
      for (let i = 0; i < prod.images.length; i++) {
        if (prod.images[i].url.includes('kaveen')) {
          const uploaded = await uploadToNewCloudinary(prod.images[i].url, prod.images[i].public_id);
          if (uploaded) {
            prod.images[i].url = uploaded.url;
            prod.images[i].public_id = uploaded.public_id;
            updated = true;
            if (uploaded.old_public_id) oldPublicIdsToDelete.push(uploaded.old_public_id);
          }
        }
      }

      if (prod.sizeChart && prod.sizeChart.url && prod.sizeChart.url.includes('kaveen')) {
        const uploaded = await uploadToNewCloudinary(prod.sizeChart.url, prod.sizeChart.public_id);
        if (uploaded) {
          prod.sizeChart.url = uploaded.url;
          prod.sizeChart.public_id = uploaded.public_id;
          updated = true;
          if (uploaded.old_public_id) oldPublicIdsToDelete.push(uploaded.old_public_id);
        }
      }

      if (updated) {
        await prod.save({ validateBeforeSave: false });
      }
    }
    console.log('Products migration completed.');

    // 3. Users (Cart)
    const users = await User.find({});
    for (const user of users) {
      let updated = false;
      for (let i = 0; i < user.cart.length; i++) {
        if (user.cart[i].image && user.cart[i].image.includes('kaveen')) {
          // Cart images usually don't have public_id stored alongside, so we derive it or just upload without strict folder
          const oldUrl = user.cart[i].image;
          const urlParts = oldUrl.split('/upload/');
          let oldPublicId = null;
          if (urlParts.length > 1) {
            // e.g. v1775669967/salt-and-fade/collections/vcngyl70oqbwpnfsulcd.jpg
            const pathParts = urlParts[1].split('/');
            pathParts.shift(); // remove version
            oldPublicId = pathParts.join('/').split('.')[0];
          }
          const uploaded = await uploadToNewCloudinary(oldUrl, oldPublicId);
          if (uploaded) {
            user.cart[i].image = uploaded.url;
            updated = true;
            if (oldPublicId && !oldPublicIdsToDelete.includes(oldPublicId)) {
               oldPublicIdsToDelete.push(oldPublicId);
            }
          }
        }
      }
      if (updated) {
        await user.save({ validateBeforeSave: false });
      }
    }
    console.log('Users (Cart) migration completed.');

    // 4. Orders
    const orders = await Order.find({});
    for (const order of orders) {
      let updated = false;
      for (let i = 0; i < order.orderItems.length; i++) {
        if (order.orderItems[i].image && order.orderItems[i].image.includes('kaveen')) {
          const oldUrl = order.orderItems[i].image;
          const urlParts = oldUrl.split('/upload/');
          let oldPublicId = null;
          if (urlParts.length > 1) {
            const pathParts = urlParts[1].split('/');
            pathParts.shift();
            oldPublicId = pathParts.join('/').split('.')[0];
          }
          const uploaded = await uploadToNewCloudinary(oldUrl, oldPublicId);
          if (uploaded) {
            order.orderItems[i].image = uploaded.url;
            updated = true;
            if (oldPublicId && !oldPublicIdsToDelete.includes(oldPublicId)) {
               oldPublicIdsToDelete.push(oldPublicId);
            }
          }
        }
      }
      if (updated) {
        await order.save({ validateBeforeSave: false });
      }
    }
    console.log('Orders migration completed.');

    console.log('Migration to New Cloudinary Finished Successfully!');
    console.log('Now proceeding to delete images from OLD Cloudinary account safely...');

    // Switch to OLD Cloudinary Configuration
    cloudinary.config({
      cloud_name: process.env.OLD_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.OLD_CLOUDINARY_API_KEY,
      api_secret: process.env.OLD_CLOUDINARY_API_SECRET,
    });

    console.log(`Using Old Cloudinary: ${process.env.OLD_CLOUDINARY_CLOUD_NAME}`);
    
    // Remove duplicates
    const uniqueIdsToDelete = [...new Set(oldPublicIdsToDelete)];
    
    let deletedCount = 0;
    for (const pid of uniqueIdsToDelete) {
      if (pid) {
        try {
          const res = await cloudinary.uploader.destroy(pid);
          console.log(`Deleted ${pid} from old account: ${res.result}`);
          deletedCount++;
        } catch (delErr) {
          console.error(`Failed to delete ${pid} from old account:`, delErr);
        }
      }
    }

    console.log(`Safely deleted ${deletedCount} images from the old account.`);
    process.exit(0);

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  }
}

runMigration();
