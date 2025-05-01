const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const trainerStudentLinkSchema = new mongoose.Schema({
  _id: { type: String, default: uuidv4 },
  trainerId: { type: String, ref: 'User', required: true },
  studentId: { type: String, ref: 'User', required: true }
}, { timestamps: true });

module.exports = mongoose.model('TrainerStudentLink', trainerStudentLinkSchema);
