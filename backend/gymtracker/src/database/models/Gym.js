// src/gym/models/Gym.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const gymSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  location: { type: String },
  // Se almacenan los IDs (de tipo String, ya que usamos UUID) de las máquinas asociadas
  machines: [{ type: String, ref: 'Machine' }]
}, { timestamps: true });

module.exports = mongoose.model('Gym', gymSchema);
