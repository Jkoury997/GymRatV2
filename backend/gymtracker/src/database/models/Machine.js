// src/gym/models/Machine.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const machineSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  type: { type: String },
  // gymId es String, ya que Gym usa UUID
  gymId: { type: String, ref: 'Gym', required: true },
  // Opcional: ejercicios vinculados; se define el _id de Exercise como String (UUID)
  linkedExercises: [{ type: String, ref: 'Exercise' }],
  category: { type: String, ref: 'Category' } // << aquí lo vinculás
}, { timestamps: true });

module.exports = mongoose.model('Machine', machineSchema);
