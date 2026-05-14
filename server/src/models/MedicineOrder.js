const mongoose = require('mongoose');

const medicineOrderSchema = new mongoose.Schema({
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  pharmacyId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  items: [{
    medicineId: { type: mongoose.Schema.Types.ObjectId, ref: 'Medicine' },
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true }
  }],
  totalAmount: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'accepted', 'preparing', 'out-for-delivery', 'delivered', 'cancelled'], 
    default: 'pending' 
  },
  deliveryAddress: { type: String, required: true },
  patientPhone: { type: String, required: true },
  patientName: { type: String, required: true },
  prescriptionImage: { type: String, default: '' },
  paymentStatus: { type: String, enum: ['pending', 'completed'], default: 'pending' },
  trackingId: { type: String, unique: true },
  estimatedDelivery: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('MedicineOrder', medicineOrderSchema);
