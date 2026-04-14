const mongoose = require('mongoose');

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    name: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        public_id: { type: String, required: true },
      }
    ],
    category: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    collectionRef: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Collection',
    },
    price: {
      type: Number,
      required: true,
      default: 0,
    },
    countInStock: {
      S: { type: Number, required: true, default: 0 },
      M: { type: Number, required: true, default: 0 },
      L: { type: Number, required: true, default: 0 },
      XL: { type: Number, required: true, default: 0 },
    },
    sizeChart: {
      url: { type: String },
      public_id: { type: String },
    },
  },
  {
    timestamps: true,
  }
);

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
