const appointmentService = require('../services/appointmentService');
const logger = require('../utils/logger');
const { z } = require('zod');

const createSchema = z.object({
  doctorId: z.string(),
  doctorName: z.string(),
  department: z.string(),
  date: z.string(),
  time: z.string(),
  consultationType: z.enum(['video', 'in-person']),
  problemDescription: z.string().min(10),
  patientName: z.string(),
  patientPhone: z.string(),
  patientEmail: z.string(),
});

exports.create = async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const appointment = await appointmentService.create({ patientId: req.user.id, ...data });
    logger.info(`Audit: Appointment created`, { appointmentId: appointment._id, userId: req.user.id });
    res.status(201).json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

exports.getAll = async (req, res, next) => {
  try {
    const appointments = await appointmentService.getByUser(req.user.id, req.user.role);
    res.json({ success: true, data: appointments });
  } catch (err) { next(err); }
};

exports.update = async (req, res, next) => {
  try {
    const appointment = await appointmentService.updateStatus(req.params.id, req.body.status, req.user.id);
    logger.info(`Audit: Appointment status updated`, { appointmentId: req.params.id, status: req.body.status, userId: req.user.id });
    res.json({ success: true, data: appointment });
  } catch (err) { next(err); }
};

exports.getAllForAdmin = async (req, res, next) => {
  try {
    const Appointment = require('../models/Appointment');
    const appointments = await Appointment.find({ isDeleted: false }).sort({ createdAt: -1 });
    res.json({ success: true, data: appointments });
  } catch (err) { next(err); }
};
