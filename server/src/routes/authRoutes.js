const router = require('express').Router();
const { register, login, logout, me } = require('../controllers/authController');
const { auth } = require('../middlewares/auth');

router.post('/register', register);
router.post('/register/doctor', require('../middlewares/uploadMiddleware').single('license'), register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', auth, me);

module.exports = router;
