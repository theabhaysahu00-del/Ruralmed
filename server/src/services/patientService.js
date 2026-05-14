const User = require('../models/User');
const Patient = require('../models/Patient');
const MedicalRecord = require('../models/MedicalRecord');
const AppError = require('../utils/AppError');

class PatientService {
  async getProfile(userId) {
    const patient = await Patient.findOne({ userId, isDeleted: false }).populate('userId').lean();
    if (!patient) throw new AppError('Patient profile not found', 404);
    return patient;
  }

  async updateProfile(userId, data) {
    const patient = await Patient.findOneAndUpdate({ userId }, data, { new: true, runValidators: true });
    if (!patient) throw new AppError('Patient profile not found', 404);
    return patient;
  }

  async getMedicalRecords(userId) {
    return MedicalRecord.find({ patient: userId, isDeleted: { $ne: true } })
      .populate('doctor', 'name')
      .populate('prescription')
      .sort('-createdAt')
      .lean();
  }
}

module.exports = new PatientService();
