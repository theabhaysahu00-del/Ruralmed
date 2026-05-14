const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  appointmentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Appointment' },
  medicines: [{
    name: { type: String, required: true },
    dosage: { type: String, required: true },
    frequency: { type: String },
    duration: { type: String },
  }],
  notes: { type: String, default: '' },
  diagnosis: { type: String, default: '' },
  status: { type: String, enum: ['draft', 'issued', 'dispensed'], default: 'issued' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

prescriptionSchema.index({ patientId: 1 });
prescriptionSchema.index({ doctorId: 1 });
prescriptionSchema.index({ appointmentId: 1 });

module.exports = mongoose.model('Prescription', prescriptionSchema);
