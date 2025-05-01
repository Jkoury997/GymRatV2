const mongoose = require('mongoose');

const roleSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },       // UUID del usuario
    role: { type: String, required: true }            // Nombre del rol (ej: 'admin', 'user', etc.)
  },
  { timestamps: true }
);

module.exports = mongoose.model('Role', roleSchema);
