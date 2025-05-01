const mongoose = require('mongoose');

const refreshTokenSchema = new mongoose.Schema({
    token: { type: String, required: true },
    userId: { type: String, ref: 'User', required: true }, // Cambiado a String porque el user._id es UUID
    createdAt: { type: Date, default: Date.now },
    expiresAt: { 
      type: Date, 
      required: true,
      // Por ejemplo, para establecer 30 días de expiración:
      default: () => new Date(Date.now() + 30*24*60*60*1000) 
    }
});

// Agregar índice para eliminar tokens expirados automáticamente
refreshTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('RefreshToken', refreshTokenSchema);
