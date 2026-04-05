const express = require('express');
const router = express.Router();
const {
  getCollections,
  getCollectionById,
  deleteCollection,
  createCollection,
  updateCollection,
} = require('../controllers/collectionController.js');
const { protect, admin } = require('../middleware/authMiddleware.js');

router.route('/').get(getCollections).post(protect, admin, createCollection);
router
  .route('/:id')
  .get(getCollectionById)
  .delete(protect, admin, deleteCollection)
  .put(protect, admin, updateCollection);

module.exports = router;
