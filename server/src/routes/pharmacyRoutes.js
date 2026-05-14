const router = require('express').Router();
const { getMedicines, updateStock, addMedicine } = require('../controllers/pharmacyController');
const { auth, authorize } = require('../middlewares/auth');

router.get('/medicines', getMedicines);
router.post('/update-stock', auth, authorize('pharmacy'), updateStock);
router.post('/medicines', auth, authorize('pharmacy', 'admin'), addMedicine);

module.exports = router;
