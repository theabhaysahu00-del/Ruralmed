const Prescription = require('../models/Prescription');
const MedicalRecord = require('../models/MedicalRecord');
const AppError = require('../utils/AppError');
const logger = require('../utils/logger');

class PrescriptionService {
  async create({ patientId, doctorId, appointmentId, medicines, dosage, diagnosis, notes }) {
    const prescription = await Prescription.create({
      patientId, doctorId, appointmentId, medicines, dosage, notes, diagnosis
    });

    // Auto-create a medical record
    await MedicalRecord.create({
      patient: patientId,
      doctor: doctorId,
      type: 'prescription',
      title: `Prescription - ${diagnosis}`,
      description: notes,
      prescription: prescription._id,
    });

    logger.info(`Prescription created: ${prescription._id}`);
    return prescription;
  }

  async getById(id) {
    const prescription = await Prescription.findOne({ _id: id, isDeleted: false })
      .populate('patientId', 'name phone age')
      .populate('doctorId', 'name')
      .lean();
    if (!prescription) throw new AppError('Prescription not found', 404);
    return prescription;
  }

  async getByPatient(patientId) {
    return await Prescription.find({ patientId, isDeleted: false })
      .populate('doctorId', 'name')
      .sort({ createdAt: -1 })
      .lean();
  }

  async getByDoctor(doctorId) {
    return await Prescription.find({ doctorId, isDeleted: false })
      .populate('patientId', 'name')
      .sort({ createdAt: -1 })
      .lean();
  }
}

module.exports = new PrescriptionService();
