const Settings = require('../models/Settings');

// @desc    Get settings
// @route   GET /api/settings
// @access  Public
const getSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      // Create default settings if not exists
      settings = await Settings.create({
        cardPaymentDiscount: {
          percentage: 5,
          isActive: true,
        },
        promoCodeFeature: {
          isActive: false,
        },
      });
    } else if (!settings.promoCodeFeature) {
      settings.promoCodeFeature = { isActive: false };
      await settings.save();
    }
    res.json(settings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update settings
// @route   PUT /api/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
  try {
    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({
        cardPaymentDiscount: {
          percentage: 5,
          isActive: true,
        },
        promoCodeFeature: {
          isActive: false,
        },
      });
    }

    if (!settings.promoCodeFeature) {
      settings.promoCodeFeature = { isActive: false };
    }

    if (req.body.cardPaymentDiscount) {
      const { isActive, percentage, activeFrom, activeUntil } = req.body.cardPaymentDiscount;

      if (isActive !== undefined) {
        settings.cardPaymentDiscount.isActive = Boolean(isActive);
      }

      if (percentage !== undefined) {
        const parsedPercentage = Number(percentage);
        if (isNaN(parsedPercentage) || parsedPercentage < 0 || parsedPercentage > 100) {
          return res.status(400).json({ message: 'Discount percentage must be a number between 0 and 100.' });
        }
        settings.cardPaymentDiscount.percentage = Math.round(parsedPercentage * 100) / 100;
      }

      if (activeFrom !== undefined) {
        settings.cardPaymentDiscount.activeFrom = activeFrom ? new Date(activeFrom) : null;
      }

      if (activeUntil !== undefined) {
        settings.cardPaymentDiscount.activeUntil = activeUntil ? new Date(activeUntil) : null;
      }
    }

    if (req.body.promoCodeFeature) {
      if (req.body.promoCodeFeature.isActive !== undefined) {
        settings.promoCodeFeature.isActive = Boolean(req.body.promoCodeFeature.isActive);
      }
    }

    const updatedSettings = await settings.save();
    res.json(updatedSettings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getSettings, updateSettings };
