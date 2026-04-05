const express = require('express');
const router = express.Router();
const {
  authUser,
  registerUser,
  getUserProfile,
  getUserCart,
  updateUserCart,
} = require('../controllers/userController.js');
const { protect } = require('../middleware/authMiddleware.js');

router.route('/').post(registerUser);
router.post('/login', authUser);
router.route('/profile').get(protect, getUserProfile);
router.route('/cart').get(protect, getUserCart).put(protect, updateUserCart);

module.exports = router;
