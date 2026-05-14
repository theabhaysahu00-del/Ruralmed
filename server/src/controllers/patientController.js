const patientService = require('../services/patientService');

exports.getProfile = async (req, res, next) => {
  try {
    const user = await patientService.getProfile(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const user = await patientService.updateProfile(req.user.id, req.body);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.getMedicalRecords = async (req, res, next) => {
  try {
    const records = await patientService.getMedicalRecords(req.user.id);
    res.json({ success: true, data: records });
  } catch (err) { next(err); }
};
