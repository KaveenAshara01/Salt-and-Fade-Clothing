const Collection = require('../models/Collection.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Fetch all collections
// @route   GET /api/collections
// @access  Public
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find({});
    res.json(collections);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single collection
// @route   GET /api/collections/:id
// @access  Public
const getCollectionById = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (collection) {
      res.json(collection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a collection
// @route   POST /api/collections
// @access  Private/Admin
const createCollection = async (req, res) => {
  try {
    const { name, image, description, public_id } = req.body;
    
    const collection = new Collection({
      name: name || 'Sample Collection',
      image: image || '/images/sample.jpg',
      description: description || 'Sample description',
      public_id: public_id || null
    });

    const createdCollection = await collection.save();
    res.status(201).json(createdCollection);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a collection
// @route   PUT /api/collections/:id
// @access  Private/Admin
const updateCollection = async (req, res) => {
  try {
    const { name, image, description, public_id } = req.body;

    const collection = await Collection.findById(req.params.id);

    if (collection) {
      // Delete old image from Cloudinary if image is updated
      if (image && collection.image !== image && collection.public_id) {
        await cloudinary.uploader.destroy(collection.public_id);
      }

      collection.name = name || collection.name;
      collection.image = image || collection.image;
      collection.public_id = public_id || collection.public_id;
      collection.description = description || collection.description;

      const updatedCollection = await collection.save();
      res.json(updatedCollection);
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a collection
// @route   DELETE /api/collections/:id
// @access  Private/Admin
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (collection) {
      // Delete image from Cloudinary
      if (collection.public_id) {
        await cloudinary.uploader.destroy(collection.public_id);
      }
      await Collection.deleteOne({ _id: collection._id });
      res.json({ message: 'Collection removed' });
    } else {
      res.status(404).json({ message: 'Collection not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getCollections,
  getCollectionById,
  createCollection,
  updateCollection,
  deleteCollection,
};
