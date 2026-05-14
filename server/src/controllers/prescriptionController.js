const prescriptionService = require('../services/prescriptionService');
const logger = require('../utils/logger');
const { z } = require('zod');

const createSchema = z.object({
  patientId: z.string(),
  appointmentId: z.string().optional(),
  medicines: z.array(z.object({
    name: z.string(),
    dosage: z.string(),
    frequency: z.string().optional(),
    duration: z.string().optional(),
  })),
  diagnosis: z.string(),
  notes: z.string().optional(),
});

exports.create = async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const prescription = await prescriptionService.create({ doctorId: req.user.id, ...data });
    logger.info(`Audit: Prescription created`, { prescriptionId: prescription._id, doctorId: req.user.id, patientId: data.patientId });
    res.status(201).json({ success: true, data: prescription });
  } catch (err) { next(err); }
};

exports.getById = async (req, res, next) => {
  try {
    const prescription = await prescriptionService.getById(req.params.id);
    res.json({ success: true, data: prescription });
  } catch (err) { next(err); }
};

exports.getByPatient = async (req, res, next) => {
  try {
    const patientId = req.user.role === 'patient' ? req.user.id : req.query.patientId;
    const prescriptions = await prescriptionService.getByPatient(patientId);
    res.json({ success: true, data: prescriptions });
  } catch (err) { next(err); }
};

exports.getByDoctor = async (req, res, next) => {
  try {
    const prescriptions = await prescriptionService.getByDoctor(req.user.id);
    res.json({ success: true, data: prescriptions });
  } catch (err) { next(err); }
};
