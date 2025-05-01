// src/gym/models/Exercise.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const exerciseUserSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  name: { type: String, required: true },
  // userId es String (UUID) del creador
  userId: { type: String, ref: 'User', required: true },
  // Opcional: vinculación a una máquina
  machineId: { type: String, ref: 'Machine' },
  category: {
    type: String, // Si `Category` usa UUID, cambiá a `type: String`
    ref: 'Category',
    required: true
  },
  exerciseGeneral: {
    type: String, // Si `Category` usa UUID, cambiá a `type: String`
    ref: 'Exercise'
  },
}, { timestamps: true });

module.exports = mongoose.model('ExerciseUser',exerciseUserSchema);
