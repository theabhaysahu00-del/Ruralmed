const deliveryService = require('../services/deliveryService');

exports.initiate = async (req, res, next) => {
  try {
    const delivery = await deliveryService.initiateDelivery(req.body);
    res.status(201).json({ success: true, data: delivery });
  } catch (err) { next(err); }
};

exports.updateStatus = async (req, res, next) => {
  try {
    const delivery = await deliveryService.updateStatus(req.params.id, req.body.status, req.body.location);
    res.json({ success: true, data: delivery });
  } catch (err) { next(err); }
};

exports.getHistory = async (req, res, next) => {
  try {
    const deliveries = await deliveryService.getPatientDeliveries(req.user.id);
    res.json({ success: true, data: deliveries });
  } catch (err) { next(err); }
};
