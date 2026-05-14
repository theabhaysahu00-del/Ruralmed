const mongoose = require('mongoose');

const patientSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  age: { type: Number, required: true },
  gender: { type: String, enum: ['male', 'female', 'other'], required: true },
  medicalHistory: [{ type: String }],
  allergies: [{ type: String }],
  bloodGroup: { type: String, default: '' },
  emergencyContact: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Patient', patientSchema);
