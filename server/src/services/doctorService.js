const Doctor = require('../models/Doctor');
const AppError = require('../utils/AppError');

class DoctorService {
  async getAllDoctors(query = {}) {
    const page = parseInt(query.page) || 1;
    const limit = parseInt(query.limit) || 10;
    const skip = (page - 1) * limit;

    const filter = { isAvailable: true, isDeleted: false };
    if (query.specialization) filter.specialization = new RegExp(query.specialization, 'i');

    const doctors = await Doctor.find(filter)
      .populate('userId', 'name email phone avatar')
      .sort('-rating')
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Doctor.countDocuments(filter);

    return {
      doctors,
      pagination: {
        total,
        page,
        pages: Math.ceil(total / limit),
      }
    };
  }

  async getDoctorById(id) {
    const doctor = await Doctor.findOne({ _id: id, isDeleted: false })
      .populate('userId', 'name email phone avatar')
      .lean();
    if (!doctor) throw new AppError('Doctor not found', 404);
    return doctor;
  }

  async updateAvailability(userId, availability) {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) throw new AppError('Doctor profile not found', 404);
    doctor.availability = availability;
    await doctor.save();
    return doctor;
  }

  async toggleAvailability(userId) {
    const doctor = await Doctor.findOne({ userId });
    if (!doctor) throw new AppError('Doctor profile not found', 404);
    doctor.isAvailable = !doctor.isAvailable;
    await doctor.save();
    return doctor;
  }
}

module.exports = new DoctorService();
