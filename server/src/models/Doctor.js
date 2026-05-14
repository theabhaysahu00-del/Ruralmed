const mongoose = require('mongoose');

const doctorSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  specialization: { type: String, required: true },
  department: { type: String, required: true },
  experience: { type: Number, required: true },
  licenseNumber: { type: String, required: true },
  hospital: { type: String, default: '' },
  documentUrl: { type: String, default: '' },
  availability: [{
    day: { type: String, enum: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] },
    startTime: String,
    endTime: String,
  }],
  rating: { type: Number, default: 0, min: 0, max: 5 },
  consultationFee: { type: Number, default: 500 },
  totalConsultations: { type: Number, default: 0 },
  isAvailable: { type: Boolean, default: true },
  bio: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

module.exports = mongoose.model('Doctor', doctorSchema);
