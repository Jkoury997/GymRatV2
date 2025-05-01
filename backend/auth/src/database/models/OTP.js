const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema(
  {
    otpCode: { type: String, required: true },
    userId: { type: String, ref: 'User', required: true }, // Se asume que el _id del usuario es un UUID (String)
    expiresAt: { type: Date, required: true },
    isUsed: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model('OTP', otpSchema);
