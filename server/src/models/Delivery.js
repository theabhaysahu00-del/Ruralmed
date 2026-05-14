const mongoose = require('mongoose');

const deliverySchema = new mongoose.Schema({
  prescriptionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Prescription', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Pharmacy', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  status: {
    type: String,
    enum: ['pending', 'out-for-delivery', 'delivered', 'failed'],
    default: 'pending',
  },
  deliveryPerson: {
    name: String,
    phone: String,
  },
  estimatedDelivery: Date,
  actualDelivery: Date,
  trackingHistory: [{
    status: String,
    location: String,
    timestamp: { type: Date, default: Date.now },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Delivery', deliverySchema);
