const router = require('express').Router();
const { create, getById, getByPatient, getByDoctor } = require('../controllers/prescriptionController');
const { auth, authorize } = require('../middlewares/auth');

router.post('/', auth, authorize('doctor'), create);
router.get('/patient', auth, authorize('patient'), getByPatient);
router.get('/doctor', auth, authorize('doctor'), getByDoctor);
router.get('/:id', auth, getById);

module.exports = router;
