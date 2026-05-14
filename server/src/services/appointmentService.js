const Appointment = require('../models/Appointment');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class AppointmentService {
  async create(data) {
    const appointment = await Appointment.create(data);
    logger.info(`Appointment created: ${appointment._id}`);
    return appointment;
  }

  async getByUser(userId, role) {
    const filter = role === 'doctor'
      ? { doctorId: userId, isDeleted: false }
      : { patientId: userId, isDeleted: false };

    return Appointment.find(filter)
      .populate('patientId', 'name phone')
      .populate('doctorId', 'name')
      .sort('-date')
      .lean();
  }

  async updateStatus(appointmentId, status, userId) {
    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) throw new AppError('Appointment not found', 404);
    appointment.status = status;
    await appointment.save();
    logger.info(`Appointment ${appointmentId} updated to ${status}`);
    return appointment;
  }
}

module.exports = new AppointmentService();
