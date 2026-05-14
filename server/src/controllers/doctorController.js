const authService = require('../services/authService');
const doctorService = require('../services/doctorService');

exports.loginDoctor = async (req, res, next) => {
  try {
    const { user, token } = await authService.login(req.body);
    if (user.role !== 'doctor') {
      return res.status(403).json({ success: false, message: 'Unauthorized role access.' });
    }
    res.cookie('token', token, { httpOnly: true, secure: process.env.NODE_ENV === 'production', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: { user, token } });
  } catch (err) { next(err); }
};

exports.getAllDoctors = async (req, res, next) => {
  try {
    const { doctors, pagination } = await doctorService.getAllDoctors(req.query);
    res.json({ success: true, data: doctors, pagination });
  } catch (err) { next(err); }
};

exports.getDoctorById = async (req, res, next) => {
  try {
    const doctor = await doctorService.getDoctorById(req.params.id);
    res.json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

exports.updateAvailability = async (req, res, next) => {
  try {
    const doctor = await doctorService.updateAvailability(req.user.id, req.body.slots);
    res.json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

exports.toggleAvailability = async (req, res, next) => {
  try {
    const doctor = await doctorService.toggleAvailability(req.user.id);
    res.json({ success: true, data: doctor });
  } catch (err) { next(err); }
};
