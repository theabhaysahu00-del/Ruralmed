const router = require('express').Router();
const { analyze } = require('../controllers/symptomController');

router.post('/', analyze);

module.exports = router;
