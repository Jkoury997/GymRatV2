// src/gym/models/Event.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const eventSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  title: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String },
  type: { type: String, enum: ['personal', 'group', 'self'], default: 'personal' },
  // userId es String (UUID) del propietario del evento
  userId: { type: String, ref: 'User', required: true },
  // Opcional: para eventos de grupo o para entrenadores
  studentId: { type: String, ref: 'User' },
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Event', eventSchema);
