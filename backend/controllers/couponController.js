const Coupon = require('../models/Coupon');
const Settings = require('../models/Settings');

// @desc    Validate a promo code for checkout
// @route   POST /api/coupons/validate
// @access  Public
const validateCoupon = async (req, res) => {
  try {
    const { code } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ message: 'Please enter a promo code.' });
    }

    const settings = await Settings.findOne();
    if (!settings || !settings.promoCodeFeature || !settings.promoCodeFeature.isActive) {
      return res.status(400).json({ message: 'Promo code feature is currently disabled.' });
    }

    const cleanCode = code.toUpperCase().trim();
    const coupon = await Coupon.findOne({ code: cleanCode, isActive: true });

    if (!coupon) {
      return res.status(400).json({ message: 'Invalid or inactive promo code.' });
    }

    res.json({
      valid: true,
      code: coupon.code,
      percentage: coupon.percentage,
    });
  } catch (error) {
    console.error('validateCoupon error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find({}).sort({ createdAt: -1 });
    res.json(coupons);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a new coupon
// @route   POST /api/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
  try {
    const { code, percentage, isActive } = req.body;

    if (!code || typeof code !== 'string' || !code.trim()) {
      return res.status(400).json({ message: 'Promo code name is required.' });
    }

    const cleanCode = code.toUpperCase().trim();
    const parsedPercentage = Number(percentage);

    if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
      return res.status(400).json({ message: 'Percentage must be a number between 0 and 100.' });
    }

    const existing = await Coupon.findOne({ code: cleanCode });
    if (existing) {
      return res.status(400).json({ message: `Promo code "${cleanCode}" already exists.` });
    }

    const coupon = await Coupon.create({
      code: cleanCode,
      percentage: Math.round(parsedPercentage * 100) / 100,
      isActive: isActive !== undefined ? Boolean(isActive) : true,
    });

    res.status(201).json(coupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update coupon (toggle active or change percentage)
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    if (req.body.code) {
      const cleanCode = req.body.code.toUpperCase().trim();
      const existing = await Coupon.findOne({ code: cleanCode, _id: { $ne: coupon._id } });
      if (existing) {
        return res.status(400).json({ message: `Promo code "${cleanCode}" already exists.` });
      }
      coupon.code = cleanCode;
    }

    if (req.body.percentage !== undefined) {
      const parsedPercentage = Number(req.body.percentage);
      if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
        return res.status(400).json({ message: 'Percentage must be between 0 and 100.' });
      }
      coupon.percentage = Math.round(parsedPercentage * 100) / 100;
    }

    if (req.body.isActive !== undefined) {
      coupon.isActive = Boolean(req.body.isActive);
    }

    const updatedCoupon = await coupon.save();
    res.json(updatedCoupon);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) {
      return res.status(404).json({ message: 'Coupon not found.' });
    }

    await coupon.deleteOne();
    res.json({ message: 'Coupon deleted successfully.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  validateCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon,
};
