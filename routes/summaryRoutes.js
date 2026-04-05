const express=require('express');
const { getSummary } = require('../controllers/summaryController');
const { authenticate, authorize } = require('../middlewares/auth');
const router = express.Router();

router.get('/', authenticate, authorize(['ADMIN', 'ANALYST', 'VIEWER']), getSummary);

module.exports = router;