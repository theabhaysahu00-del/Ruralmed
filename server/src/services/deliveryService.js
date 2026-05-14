const Delivery = require('../models/Delivery');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class DeliveryService {
  async initiateDelivery({ prescriptionId, pharmacyId, patientId }) {
    const delivery = await Delivery.create({
      prescriptionId,
      pharmacyId,
      patientId,
      status: 'pending'
    });
    logger.info(`Delivery initiated for prescription ${prescriptionId}`);
    return delivery;
  }

  async updateStatus(deliveryId, status, location) {
    const delivery = await Delivery.findById(deliveryId);
    if (!delivery) throw new AppError('Delivery not found', 404);
    
    delivery.status = status;
    delivery.trackingHistory.push({ status, location });
    
    if (status === 'delivered') delivery.actualDelivery = new Date();
    
    await delivery.save();
    return delivery;
  }

  async getPatientDeliveries(patientId) {
    return Delivery.find({ patientId }).populate('pharmacyId', 'name village').sort('-createdAt');
  }
}

module.exports = new DeliveryService();
