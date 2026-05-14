const router = require('express').Router();
const { getProfile, updateProfile, getMedicalRecords } = require('../controllers/patientController');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth, authorize('patient'));

router.get('/profile', getProfile);
router.put('/update', updateProfile);
router.get('/records', getMedicalRecords);

module.exports = router;
