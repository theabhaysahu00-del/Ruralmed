const mongoose = require('mongoose');
const MedicineOrder = require('../models/MedicineOrder');
const Medicine = require('../models/Medicine');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

exports.createOrder = async (req, res, next) => {
  try {
    const { pharmacyId, items, totalAmount, deliveryAddress, patientPhone, patientName } = req.body;
    
    // Create the order
    const order = await MedicineOrder.create({
      patientId: req.user.id,
      pharmacyId,
      items,
      totalAmount,
      deliveryAddress,
      patientPhone,
      patientName,
      trackingId: `ORD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      prescriptionImage: req.file ? `/uploads/prescriptions/${req.file.filename}` : ''
    });

    // Update stock levels
    for (const item of items) {
      await Medicine.findByIdAndUpdate(item.medicineId, {
        $inc: { stock: -item.quantity }
      });
    }

    res.status(201).json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.getPatientOrders = async (req, res, next) => {
  try {
    const orders = await MedicineOrder.find({ patientId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('pharmacyId', 'name village');
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.getPharmacyOrders = async (req, res, next) => {
  try {
    const orders = await MedicineOrder.find({ pharmacyId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('patientId', 'name phone');
    res.json({ success: true, data: orders });
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const { status, estimatedDelivery } = req.body;
    const order = await MedicineOrder.findOneAndUpdate(
      { _id: req.params.id, pharmacyId: req.user.id },
      { status, estimatedDelivery },
      { new: true }
    );

    if (!order) throw new AppError('Order not found', 404);
    
    res.json({ success: true, data: order });
  } catch (err) { next(err); }
};

exports.getPharmacyStats = async (req, res, next) => {
  try {
    const pharmacyId = req.user.id;
    
    const [totalMedicines, totalOrders, revenue, expiringSoon, revenueByDate] = await Promise.all([
      Medicine.countDocuments({ pharmacy: pharmacyId, isDeleted: false }),
      MedicineOrder.countDocuments({ pharmacyId }),
      MedicineOrder.aggregate([
        { $match: { pharmacyId: new mongoose.Types.ObjectId(pharmacyId), status: 'delivered' } },
        { $group: { _id: null, total: { $sum: '$totalAmount' } } }
      ]),
      Medicine.countDocuments({ 
        pharmacy: pharmacyId, 
        isDeleted: false,
        expiryDate: { $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) }
      }),
      MedicineOrder.aggregate([
        { $match: { pharmacyId: new mongoose.Types.ObjectId(pharmacyId) } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            dailyRevenue: { $sum: "$totalAmount" },
            orderCount: { $sum: 1 }
          }
        },
        { $sort: { _id: 1 } },
        { $limit: 30 }
      ])
    ]);

    const totalRevenue = await MedicineOrder.aggregate([
      { $match: { pharmacyId: new mongoose.Types.ObjectId(pharmacyId) } },
      { $group: { _id: null, total: { $sum: '$totalAmount' } } }
    ]);

    res.json({
      success: true,
      data: {
        totalMedicines,
        totalOrders,
        revenue: revenue[0]?.total || 0,
        totalRevenue: totalRevenue[0]?.total || 0,
        expiringSoon,
        revenueByDate
      }
    });
  } catch (err) { next(err); }
};
