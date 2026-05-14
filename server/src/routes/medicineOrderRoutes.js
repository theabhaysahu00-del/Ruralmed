const express = require('express');
const router = express.Router();
const orderController = require('../controllers/medicineOrderController');
const { auth, authorize } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/prescriptions/'),
  filename: (req, file, cb) => cb(null, `presc-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.post('/', auth, authorize('patient'), upload.single('prescription'), orderController.createOrder);
router.get('/patient', auth, authorize('patient'), orderController.getPatientOrders);
router.get('/pharmacy', auth, authorize('pharmacy'), orderController.getPharmacyOrders);
router.get('/pharmacy/stats', auth, authorize('pharmacy'), orderController.getPharmacyStats);
router.patch('/:id/status', auth, authorize('pharmacy'), orderController.updateOrderStatus);

module.exports = router;
