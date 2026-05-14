const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientName: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientEmail: { type: String, required: true },
  department: { type: String, required: true },
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  doctorName: { type: String, required: true },
  date: { type: Date, required: true },
  time: { type: String, required: true },
  consultationType: { type: String, enum: ['video', 'in-person'], default: 'video' },
  problemDescription: { type: String, required: true },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'completed', 'cancelled', 'missed'],
    default: 'pending',
  },
  videoCallLink: { type: String, default: '' },
  notes: { type: String, default: '' },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

appointmentSchema.index({ patientId: 1 });
appointmentSchema.index({ doctorId: 1 });
appointmentSchema.index({ date: 1 });

module.exports = mongoose.model('Appointment', appointmentSchema);
