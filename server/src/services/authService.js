const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Doctor = require('../models/Doctor');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AuthService {
  async register(data) {
    const { name, email, password, phone, role, village, ...extraData } = data;
    const existingUser = await User.findOne({ email });
    if (existingUser) throw new AppError('Email already registered', 400);

    // Set approvalStatus based on role
    const approvalStatus = (role === 'doctor' || role === 'pharmacy') ? 'pending' : 'approved';
    const verificationStage = (role === 'doctor' || role === 'pharmacy') ? 'submitted' : 'approved';

    const user = await User.create({ 
      name, email, password, phone, role, village, approvalStatus, verificationStage,
      ...extraData 
    });

    // If role is doctor, create a Doctor profile
    if (role === 'doctor') {
      await Doctor.create({
        userId: user._id,
        specialization: extraData.specialization || 'General Physician',
        department: extraData.specialization || 'General',
        experience: parseInt(extraData.experience) || 0,
        licenseNumber: extraData.licenseNumber || 'N/A',
        hospital: extraData.hospital || 'Default Rural Clinic',
        documentUrl: extraData.medicalLicenseFile || extraData.documentUrl || '',
        consultationFee: 500,
      });
    }

    // If role is pharmacy, create a Pharmacy profile
    if (role === 'pharmacy') {
      const Pharmacy = require('../models/Pharmacy');
      await Pharmacy.create({
        userId: user._id,
        name: extraData.pharmacyName || name,
        licenseNumber: extraData.licenseNumber || 'N/A',
        address: extraData.address || village,
        village: village || 'N/A',
        documentUrl: extraData.documentUrl || '',
      });
    }

    // If role is patient, create a Patient profile
    if (role === 'patient') {
      const Patient = require('../models/Patient');
      await Patient.create({
        userId: user._id,
        age: extraData.age || 0,
        gender: extraData.gender || 'other',
      });
    }

    const token = this.generateToken(user);
    logger.info(`User registered: ${email} (${role}) - Status: ${approvalStatus}`);
    return { user, token };
  }

  async login({ email, password }) {
    const user = await User.findOne({ email, isDeleted: false }).select('+password');
    if (!user) throw new AppError('Invalid email or password', 401);

    // Check if account is locked
    if (user.lockUntil && user.lockUntil > Date.now()) {
      const remainingTime = Math.ceil((user.lockUntil - Date.now()) / (60 * 1000));
      throw new AppError(`Account is temporarily locked. Try again in ${remainingTime} minutes.`, 403);
    }

    const isMatch = await user.comparePassword(password);
    
    if (!isMatch) {
      user.loginAttempts += 1;
      const maxAttempts = 5;
      if (user.loginAttempts >= maxAttempts) {
        user.lockUntil = Date.now() + 2 * 60 * 60 * 1000;
        await user.save();
        throw new AppError('Too many failed attempts. Account locked for 2 hours.', 403);
      }
      await user.save();
      throw new AppError('Invalid email or password', 401);
    }

    // DO NOT block pending or rejected here. Let the UI handle routing them to the Verification Status page based on their approvalStatus.
    // We only block deactivated accounts.

    if (!user.isActive) throw new AppError('Account is deactivated', 403);

    user.loginAttempts = 0;
    user.lockUntil = undefined;
    await user.save();

    const token = this.generateToken(user);
    return { user, token };
  }

  generateToken(user) {
    return jwt.sign(
      { 
        id: user._id, 
        role: user.role, 
        email: user.email,
        approvalStatus: user.approvalStatus,
        verificationStage: user.verificationStage
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );
  }
}

module.exports = new AuthService();
