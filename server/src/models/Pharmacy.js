const mongoose = require('mongoose');

const pharmacySchema = new mongoose.Schema({
  name: { type: String, required: true },
  licenseNumber: { type: String, required: true },
  address: { type: String, default: '' },
  documentUrl: { type: String, default: '' },
  village: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  medicines: [{
    name: { type: String, required: true },
    category: { type: String, default: '' },
    price: { type: Number, required: true },
    stock: { type: Number, required: true, default: 0 },
    manufacturer: { type: String, default: '' },
    requiresPrescription: { type: Boolean, default: false },
    isAvailable: { type: Boolean, default: true },
  }],
  isActive: { type: Boolean, default: true },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Pharmacy', pharmacySchema);
