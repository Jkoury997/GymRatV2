const mongoose = require('mongoose');
const { v4: uuidv4 } = require('uuid');

const categorySchema = new mongoose.Schema(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true, unique: true },
    description: { type: String,required: true },
    icon:{ type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
