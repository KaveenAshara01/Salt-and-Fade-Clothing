const express = require('express');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { protect, admin } = require('../middleware/authMiddleware.js');

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: async (req, file) => {
       const folderName = req.query.folder || 'others';
       return `salt-and-fade/${folderName}`;
    },
    allowedFormats: ['jpg', 'png', 'jpeg', 'webp'],
  },
});

const upload = multer({ storage: storage });

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  console.log('Upload Route Hit');
  console.log('Request File:', req.file);
  
  if (req.file) {
    res.send({ 
      url: req.file.path,
      image: req.file.path,
      public_id: req.file.filename
    });
  } else {
    res.status(400).send({ message: 'No file uploaded' });
  }
});

module.exports = router;
