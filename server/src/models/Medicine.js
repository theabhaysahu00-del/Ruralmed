const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  stock: { type: Number, required: true, default: 0 },
  manufacturer: { type: String, default: '' },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  expiryDate: { type: Date, required: true },
  pharmacy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  requiresPrescription: { type: Boolean, default: false },
  isAvailable: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Medicine', medicineSchema);
