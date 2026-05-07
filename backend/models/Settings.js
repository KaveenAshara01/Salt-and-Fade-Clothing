const mongoose = require('mongoose');

const settingsSchema = mongoose.Schema(
  {
    cardPaymentDiscount: {
      percentage: { type: Number, default: 5 },
      isActive: { type: Boolean, default: true },
      activeFrom: { type: Date },
      activeUntil: { type: Date },
    },
  },
  {
    timestamps: true,
  }
);

const Settings = mongoose.model('Settings', settingsSchema);

module.exports = Settings;
