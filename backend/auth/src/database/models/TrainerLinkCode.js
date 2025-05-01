// src/auth/models/TrainerLinkCode.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trainerLinkCodeSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  trainerId: { type: String, ref: 'User', required: true },
  linkCode: { type: String, required: true, unique: true }
}, { timestamps: true });

module.exports = mongoose.model('TrainerLinkCode', trainerLinkCodeSchema);
