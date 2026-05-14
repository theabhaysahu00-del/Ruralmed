const pharmacyService = require('../services/pharmacyService');

exports.getMedicines = async (req, res, next) => {
  try {
    const medicines = await pharmacyService.getMedicines(req.query);
    res.json({ success: true, data: medicines });
  } catch (err) { next(err); }
};

exports.updateStock = async (req, res, next) => {
  try {
    const medicine = await pharmacyService.updateStock(req.body.pharmacyId, req.body.medicineName, req.body.stock);
    res.json({ success: true, data: medicine });
  } catch (err) { next(err); }
};

exports.addMedicine = async (req, res, next) => {
  try {
    const medicine = await pharmacyService.addMedicine(req.body.pharmacyId, req.body.medicine);
    res.status(201).json({ success: true, data: medicine });
  } catch (err) { next(err); }
};
