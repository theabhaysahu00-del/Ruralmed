const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema({
  patient: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctor: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  type: { type: String, enum: ['consultation', 'lab-report', 'prescription', 'note'], required: true },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  attachments: [{ type: String }],
  prescription: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

medicalRecordSchema.index({ patient: 1 });
medicalRecordSchema.index({ doctor: 1 });
medicalRecordSchema.index({ createdAt: -1 });

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
