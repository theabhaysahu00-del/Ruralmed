const Medicine = require('../models/Medicine');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

exports.addMedicine = async (req, res, next) => {
  try {
    const { name, category, price, stock, manufacturer, description, expiryDate, requiresPrescription } = req.body;
    
    const medicine = await Medicine.create({
      name,
      category,
      price,
      stock,
      manufacturer,
      description,
      expiryDate,
      requiresPrescription,
      pharmacy: req.user.id,
      image: req.file ? `/uploads/medicines/${req.file.filename}` : ''
    });

    res.status(201).json({ success: true, data: medicine });
  } catch (err) { next(err); }
};

exports.getPharmacyInventory = async (req, res, next) => {
  try {
    const medicines = await Medicine.find({ 
      pharmacy: req.user.id, 
      isDeleted: false 
    }).sort({ createdAt: -1 });
    
    res.json({ success: true, data: medicines });
  } catch (err) { next(err); }
};

exports.updateMedicine = async (req, res, next) => {
  try {
    const updateData = { ...req.body };
    if (req.file) updateData.image = `/uploads/medicines/${req.file.filename}`;
    
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.user.id },
      updateData,
      { new: true, runValidators: true }
    );

    if (!medicine) throw new AppError('Medicine not found', 404);
    res.json({ success: true, data: medicine });
  } catch (err) { next(err); }
};

exports.deleteMedicine = async (req, res, next) => {
  try {
    const medicine = await Medicine.findOneAndUpdate(
      { _id: req.params.id, pharmacy: req.user.id },
      { isDeleted: true },
      { new: true }
    );
    if (!medicine) throw new AppError('Medicine not found', 404);
    res.json({ success: true, message: 'Medicine removed from inventory' });
  } catch (err) { next(err); }
};

exports.getAllMedicines = async (req, res, next) => {
  try {
    const { search, category } = req.query;
    let query = { isDeleted: false, stock: { $gt: 0 } };
    
    if (search) query.name = { $regex: search, $options: 'i' };
    if (category) query.category = category;

    const medicines = await Medicine.find(query).populate('pharmacy', 'name village');
    res.json({ success: true, data: medicines });
  } catch (err) { next(err); }
};
