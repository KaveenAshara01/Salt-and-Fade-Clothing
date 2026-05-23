const admin = require('firebase-admin');
const path = require('path');

const serviceAccountPath = path.resolve(__dirname, '../../saltandfade-firebase-adminsdk-fbsvc-e06d2babd8.json');
const serviceAccount = require(serviceAccountPath);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: process.env.FIREBASE_STORAGE_BUCKET || 'saltandfade.firebasestorage.app'
});

const bucket = admin.storage().bucket();

module.exports = { admin, bucket };
