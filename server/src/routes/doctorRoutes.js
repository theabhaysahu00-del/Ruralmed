const router = require('express').Router();
const { getAllDoctors, getDoctorById, updateAvailability, toggleAvailability, loginDoctor } = require('../controllers/doctorController');
const { auth, authorize } = require('../middlewares/auth');

router.post('/login', loginDoctor);
router.post('/register', require('../middlewares/uploadMiddleware').single('license'), require('../controllers/authController').register);
router.get('/', getAllDoctors);
router.get('/:id', getDoctorById);
router.post('/availability', auth, authorize('doctor'), updateAvailability);
router.patch('/toggle-availability', auth, authorize('doctor'), toggleAvailability);

module.exports = router;
