const Product = require('../models/Product.js');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// @desc    Fetch all products
// @route   GET /api/products
// @access  Public
const getProducts = async (req, res) => {
  try {
    const collectionId = req.query.collection;
    const sort = req.query.sort;
    const query = collectionId ? { collectionRef: collectionId } : {};
    
    let sortQuery = { createdAt: -1 }; // Default: Latest
    if (sort === 'priceAsc') sortQuery = { price: 1 };
    else if (sort === 'priceDesc') sortQuery = { price: -1 };
    else if (sort === 'latest') sortQuery = { createdAt: -1 };

    const products = await Product.find(query)
      .populate('collectionRef', 'name')
      .sort(sortQuery);
      
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single product
// @route   GET /api/products/:id
// @access  Public
const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a product
// @route   DELETE /api/products/:id
// @access  Private/Admin
const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
       // Delete all images from Cloudinary
       if (product.images && product.images.length > 0) {
         for (const img of product.images) {
           await cloudinary.uploader.destroy(img.public_id);
         }
       }
       // Delete size chart if exists
       if (product.sizeChart && product.sizeChart.public_id) {
         await cloudinary.uploader.destroy(product.sizeChart.public_id);
       }
       await Product.deleteOne({ _id: product._id });
       res.json({ message: 'Product removed' });
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a product
// @route   POST /api/products
// @access  Private/Admin
const createProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      images,
      category,
      countInStock,
      description,
      collectionRef,
      sizeChart,
    } = req.body;

    const product = new Product({
      name: name || 'New Product',
      price: price || 0,
      user: req.user._id,
      images: images || [],
      category: category || '',
      countInStock: countInStock || { S: 0, M: 0, L: 0, XL: 0 },
      description: description || '',
      collectionRef: collectionRef || null,
      sizeChart: sizeChart || { url: '', public_id: '' },
    });

    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
const updateProduct = async (req, res) => {
  try {
    const {
      name,
      price,
      description,
      images,
      category,
      countInStock,
      collectionRef,
      sizeChart,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      // Handle Image Gallery Cleanup (Delete removed images from Cloudinary)
      if (images && product.images) {
        const removedImages = product.images.filter(
          (oldImg) => !images.find((newImg) => newImg.public_id === oldImg.public_id)
        );
        
        for (const img of removedImages) {
          await cloudinary.uploader.destroy(img.public_id);
        }
      }

      // Handle Size Chart Cleanup
      if (sizeChart && product.sizeChart && product.sizeChart.public_id && sizeChart.public_id !== product.sizeChart.public_id) {
        await cloudinary.uploader.destroy(product.sizeChart.public_id);
      }

      product.name = name !== undefined ? name : product.name;
      product.price = price !== undefined ? price : product.price;
      product.description = description !== undefined ? description : product.description;
      product.images = images !== undefined ? images : product.images;
      product.category = category !== undefined ? category : product.category;
      
      if (countInStock) {
        product.countInStock = {
          S: countInStock.S !== undefined ? countInStock.S : product.countInStock.S,
          M: countInStock.M !== undefined ? countInStock.M : product.countInStock.M,
          L: countInStock.L !== undefined ? countInStock.L : product.countInStock.L,
          XL: countInStock.XL !== undefined ? countInStock.XL : product.countInStock.XL,
        };
      }
      
      product.collectionRef = collectionRef || product.collectionRef;
      product.sizeChart = sizeChart !== undefined ? sizeChart : product.sizeChart;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getProducts,
  getProductById,
  deleteProduct,
  createProduct,
  updateProduct,
};
