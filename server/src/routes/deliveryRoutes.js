const router = require('express').Router();
const { initiate, updateStatus, getHistory } = require('../controllers/deliveryController');
const { auth, authorize } = require('../middlewares/auth');

router.use(auth);

router.get('/my-deliveries', getHistory);
router.post('/initiate', authorize('pharmacy'), initiate);
router.patch('/:id/status', authorize('pharmacy'), updateStatus);

module.exports = router;
