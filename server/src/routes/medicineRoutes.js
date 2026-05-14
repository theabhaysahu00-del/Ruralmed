const express = require('express');
const router = express.Router();
const medicineController = require('../controllers/medicineController');
const { auth, authorize } = require('../middlewares/auth');
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/medicines/'),
  filename: (req, file, cb) => cb(null, `med-${Date.now()}${path.extname(file.originalname)}`)
});
const upload = multer({ storage });

router.get('/public', medicineController.getAllMedicines);
router.get('/inventory', auth, authorize('pharmacy'), medicineController.getPharmacyInventory);
router.post('/', auth, authorize('pharmacy'), upload.single('image'), medicineController.addMedicine);
router.put('/:id', auth, authorize('pharmacy'), upload.single('image'), medicineController.updateMedicine);
router.delete('/:id', auth, authorize('pharmacy'), medicineController.deleteMedicine);

module.exports = router;
