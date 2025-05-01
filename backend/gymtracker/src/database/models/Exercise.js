// src/gym/models/Exercise.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const exerciseSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  category: { type: String },
  // Opcional: vinculación a una máquina
  machineId: { type: String, ref: 'Machine' },
  category: {
    type: String, // Si `Category` usa UUID, cambiá a `type: String`
    ref: 'Category',
    required: true
  },
}, { timestamps: true });

module.exports = mongoose.model('Exercise', exerciseSchema);
