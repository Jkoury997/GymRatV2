// src/gym/models/WorkoutRecord.js
const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const workoutRecordSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  // Ahora se usa String para referenciar a Exercise, ya que Exercise usa UUID
  exerciseUserId: { type: String, ref: 'ExerciseUser', required: true },
  // userId es String (UUID) del usuario que realizó el entrenamiento
  userId: { type: String, ref: 'User', required: true },
  date: { type: Date, default: Date.now },
  series: [{
    weight: { type: Number },
    reps: { type: Number }
  }],
  notes: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('WorkoutRecord', workoutRecordSchema);
