const router = require('express').Router();
const { create, getAll, update } = require('../controllers/appointmentController');
const { auth } = require('../middlewares/auth');

router.use(auth);

router.post('/', create);
router.get('/', getAll);
router.get('/admin', require('../middlewares/auth').authorize('admin'), require('../controllers/appointmentController').getAllForAdmin);
router.put('/:id', update);

module.exports = router;
