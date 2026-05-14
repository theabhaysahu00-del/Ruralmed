const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Prescription = require('../models/Prescription');

// ─── Dashboard ───────────────────────────────────────────────────────────────

exports.getHeatmapData = async (req, res, next) => {
  try {
    const villages = ['Kishanpur', 'Rampur', 'Madhavgarh', 'Vijaypur', 'Talwara'];
    const diseases = ['Viral Fever', 'Influenza', 'Gastritis', 'Skin Allergies'];
    const heatmap = villages.map(village => ({
      village,
      cases: Math.floor(Math.random() * 50),
      topDisease: diseases[Math.floor(Math.random() * diseases.length)],
      status: Math.random() > 0.8 ? 'Warning' : 'Stable',
      coordinates: { lat: 28.6139 + (Math.random() - 0.5) * 0.1, lng: 77.2090 + (Math.random() - 0.5) * 0.1 }
    }));
    res.json({ success: true, data: heatmap });
  } catch (err) { next(err); }
};

exports.getGlobalStats = async (req, res, next) => {
  try {
    const [totalPatients, totalDoctors, activeDoctors, totalPharmacies,
           totalAppointments, completedConsultations, pendingAppointments,
           cancelledAppointments, totalPrescriptions] = await Promise.all([
      User.countDocuments({ role: 'patient', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'doctor', isDeleted: { $ne: true } }),
      User.countDocuments({ role: 'doctor', approvalStatus: 'approved', isActive: true }),
      User.countDocuments({ role: 'pharmacy', isDeleted: { $ne: true } }),
      Appointment.countDocuments({}),
      Appointment.countDocuments({ status: 'completed' }),
      Appointment.countDocuments({ status: 'pending' }),
      Appointment.countDocuments({ status: 'cancelled' }),
      Prescription.countDocuments({}),
    ]);
    res.json({
      success: true,
      data: {
        totalPatients, totalDoctors, activeDoctors, totalPharmacies,
        totalAppointments, completedConsultations, pendingAppointments,
        cancelledAppointments, totalPrescriptions,
        emergencyRequests: Math.floor(Math.random() * 6) + 1,
        medicinesSoldToday: Math.floor(Math.random() * 200) + 50,
        lowStockMedicines: Math.floor(Math.random() * 12) + 3,
        villageCoverage: 124,
        weeklyRevenue: 125000,
        platformHealth: '99.9%',
      }
    });
  } catch (err) { next(err); }
};

exports.getChartData = async (req, res, next) => {
  try {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const chartData = days.map(name => ({
      name,
      appointments: Math.floor(Math.random() * 60) + 15,
      consultations: Math.floor(Math.random() * 50) + 10,
      revenue: Math.floor(Math.random() * 15000) + 5000,
    }));
    res.json({ success: true, data: chartData });
  } catch (err) { next(err); }
};

// ─── Pending Verification ────────────────────────────────────────────────────

exports.getPendingRequests = async (req, res, next) => {
  try {
    const pendingUsers = await User.find({ approvalStatus: 'pending' }).sort({ createdAt: -1 });
    res.json({ success: true, data: pendingUsers });
  } catch (err) { next(err); }
};

exports.updateRequestStatus = async (req, res, next) => {
  try {
    const { userId, status } = req.body;
    if (!['approved', 'rejected'].includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status' });
    }
    const user = await User.findByIdAndUpdate(userId, {
      approvalStatus: status,
      verificationStage: status
    }, { new: true });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

// ─── Doctor Management ────────────────────────────────────────────────────────

exports.getAllDoctorsForAdmin = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = { role: 'doctor', isDeleted: { $ne: true } };
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { specialization: { $regex: search, $options: 'i' } },
    ];
    if (status && status !== 'all') filter.approvalStatus = status;
    const skip = (Number(page) - 1) * Number(limit);
    const [doctors, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: doctors, total, page: Number(page), limit: Number(limit) });
  } catch (err) { next(err); }
};

exports.updateDoctor = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowedFields = ['approvalStatus', 'isActive', 'specialization', 'hospital', 'experience', 'isDeleted'];
    const updates = {};
    allowedFields.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    if (updates.approvalStatus) updates.verificationStage = updates.approvalStatus;
    const doctor = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!doctor) return res.status(404).json({ success: false, message: 'Doctor not found' });
    res.json({ success: true, data: doctor });
  } catch (err) { next(err); }
};

exports.deleteDoctor = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: 'Doctor removed' });
  } catch (err) { next(err); }
};

// ─── User Management ─────────────────────────────────────────────────────────

exports.getAllUsers = async (req, res, next) => {
  try {
    const { search, role = 'patient', status, page = 1, limit = 20 } = req.query;
    const filter = { role, isDeleted: { $ne: true } };
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
      { phone: { $regex: search, $options: 'i' } },
    ];
    if (status === 'active') filter.isActive = true;
    if (status === 'suspended') filter.isActive = false;
    const skip = (Number(page) - 1) * Number(limit);
    const [users, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: users, total });
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowed = ['isActive', 'village', 'isDeleted'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const user = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    res.json({ success: true, data: user });
  } catch (err) { next(err); }
};

exports.deleteUser = async (req, res, next) => {
  try {
    await User.findByIdAndUpdate(req.params.id, { isDeleted: true });
    res.json({ success: true, message: 'User removed' });
  } catch (err) { next(err); }
};

// ─── Pharmacy Management ──────────────────────────────────────────────────────

exports.getAllPharmacies = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = { role: 'pharmacy', isDeleted: { $ne: true } };
    if (search) filter.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } },
    ];
    if (status === 'active') filter.isActive = true;
    if (status === 'suspended') filter.isActive = false;
    const skip = (Number(page) - 1) * Number(limit);
    const [pharmacies, total] = await Promise.all([
      User.find(filter).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(filter),
    ]);
    res.json({ success: true, data: pharmacies, total });
  } catch (err) { next(err); }
};

exports.updatePharmacy = async (req, res, next) => {
  try {
    const { id } = req.params;
    const allowed = ['isActive', 'approvalStatus', 'isDeleted'];
    const updates = {};
    allowed.forEach(f => { if (req.body[f] !== undefined) updates[f] = req.body[f]; });
    const pharmacy = await User.findByIdAndUpdate(id, updates, { new: true }).select('-password');
    if (!pharmacy) return res.status(404).json({ success: false, message: 'Pharmacy not found' });
    res.json({ success: true, data: pharmacy });
  } catch (err) { next(err); }
};

// ─── Appointments (Admin View) ───────────────────────────────────────────────

exports.getAllAppointments = async (req, res, next) => {
  try {
    const { search, status, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status && status !== 'all') filter.status = status;
    if (search) filter.$or = [
      { patientName: { $regex: search, $options: 'i' } },
      { doctorName: { $regex: search, $options: 'i' } },
      { department: { $regex: search, $options: 'i' } },
    ];
    const skip = (Number(page) - 1) * Number(limit);
    const [appointments, total] = await Promise.all([
      Appointment.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Appointment.countDocuments(filter),
    ]);
    res.json({ success: true, data: appointments, total });
  } catch (err) { next(err); }
};

exports.updateAppointmentStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const apt = await Appointment.findByIdAndUpdate(id, { status }, { new: true });
    if (!apt) return res.status(404).json({ success: false, message: 'Appointment not found' });
    res.json({ success: true, data: apt });
  } catch (err) { next(err); }
};

// ─── Analytics ───────────────────────────────────────────────────────────────

exports.getAnalytics = async (req, res, next) => {
  try {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyData = months.map(month => ({
      month,
      patients: Math.floor(Math.random() * 300) + 80,
      appointments: Math.floor(Math.random() * 200) + 60,
      consultations: Math.floor(Math.random() * 180) + 50,
      revenue: Math.floor(Math.random() * 80000) + 20000,
      emergency: Math.floor(Math.random() * 20) + 2,
    }));

    const departmentData = [
      { name: 'General', value: 35 },
      { name: 'Pediatrics', value: 20 },
      { name: 'Gynecology', value: 18 },
      { name: 'Cardiology', value: 12 },
      { name: 'Orthopedics', value: 10 },
      { name: 'Others', value: 5 },
    ];

    const doctorPerformance = await User.find({ role: 'doctor', approvalStatus: 'approved' })
      .select('name specialization hospital experience')
      .limit(8).lean();

    const enrichedDoctors = doctorPerformance.map(d => ({
      ...d,
      consultations: Math.floor(Math.random() * 150) + 20,
      rating: (Math.random() * 1.5 + 3.5).toFixed(1),
      revenue: Math.floor(Math.random() * 50000) + 10000,
    }));

    res.json({
      success: true,
      data: { monthlyData, departmentData, doctorPerformance: enrichedDoctors }
    });
  } catch (err) { next(err); }
};

// ─── Settings ─────────────────────────────────────────────────────────────────

// In-memory settings store (persists within server process; use DB for real persistence)
let platformSettings = {
  siteName: 'RuralMed',
  supportEmail: 'support@ruralmed.in',
  supportPhone: '+91 98765 43210',
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireDoctorVerification: true,
  defaultLanguage: 'en',
  maxLoginAttempts: 5,
  sessionTimeout: 60,
  emailNotifications: true,
  smsNotifications: false,
  emergencyAlerts: true,
};

exports.getSettings = async (req, res, next) => {
  try {
    res.json({ success: true, data: platformSettings });
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    platformSettings = { ...platformSettings, ...req.body };
    res.json({ success: true, data: platformSettings, message: 'Settings updated successfully' });
  } catch (err) { next(err); }
};
