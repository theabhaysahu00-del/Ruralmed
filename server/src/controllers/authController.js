const authService = require('../services/authService');
const { z } = require('zod');

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  role: z.enum(['patient', 'doctor', 'pharmacy', 'admin']).optional(),
  village: z.string().optional(),
  specialization: z.string().optional(),
  clinicName: z.string().optional(),
  experience: z.string().optional(),
  licenseNumber: z.string().optional(),
  medicalLicenseFile: z.string().optional(),
  hospital: z.string().optional(),
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

exports.register = async (req, res, next) => {
  try {
    // Multer parses multipart/form-data and populates req.body with text fields
    // All values from FormData come as strings, so Zod schema should expect strings
    const data = registerSchema.parse(req.body);
    
    if (req.file) {
      data.medicalLicenseFile = `/uploads/licenses/${req.file.filename}`;
    }
    
    const { user, token } = await authService.register(data);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.status(201).json({ success: true, data: { user, token } });
  } catch (err) { next(err); }
};

exports.login = async (req, res, next) => {
  try {
    const data = loginSchema.parse(req.body);
    const { user, token } = await authService.login(data);
    res.cookie('token', token, { httpOnly: true, secure: true, sameSite: 'none', maxAge: 7 * 24 * 60 * 60 * 1000 });
    res.json({ success: true, data: { user, token } });
  } catch (err) { next(err); }
};

exports.logout = (req, res) => {
  res.clearCookie('token', { httpOnly: true, secure: true, sameSite: 'none' });
  res.json({ success: true, message: 'Logged out successfully' });
};

exports.me = async (req, res, next) => {
  try {
    const User = require('../models/User');
    const user = await User.findById(req.user.id);
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};
