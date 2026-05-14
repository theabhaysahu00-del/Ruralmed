const router = require('express').Router();
const {
  getHeatmapData, getGlobalStats, getChartData,
  getPendingRequests, updateRequestStatus,
  getAllDoctorsForAdmin, updateDoctor, deleteDoctor,
  getAllUsers, updateUser, deleteUser,
  getAllPharmacies, updatePharmacy,
  getAllAppointments, updateAppointmentStatus,
  getAnalytics,
  getSettings, updateSettings,
} = require('../controllers/adminController');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth, authorize('admin'));

// Dashboard
router.get('/heatmap', getHeatmapData);
router.get('/stats', getGlobalStats);
router.get('/chart-data', getChartData);

// Verification
router.get('/pending-requests', getPendingRequests);
router.post('/verify', updateRequestStatus);

// Doctor Management
router.get('/all-doctors', getAllDoctorsForAdmin);
router.put('/doctors/:id', updateDoctor);
router.delete('/doctors/:id', deleteDoctor);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:id', updateUser);
router.delete('/users/:id', deleteUser);

// Pharmacy Management
router.get('/pharmacies', getAllPharmacies);
router.put('/pharmacies/:id', updatePharmacy);

// Appointments (Admin View)
router.get('/appointments', getAllAppointments);
router.put('/appointments/:id', updateAppointmentStatus);

// Analytics
router.get('/analytics', getAnalytics);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);

module.exports = router;
