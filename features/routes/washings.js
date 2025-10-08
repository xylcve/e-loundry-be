const express = require('express');
const router = express.Router();
const WashingsController = require('../controllers/washings.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/', verifyJwtRoles([]), WashingsController.getWashingDetail);
router.post('/check_out_room', verifyJwtRoles([]), WashingsController.checkOutRoom);
router.post('/check_in_laundry', verifyJwtRoles([]), WashingsController.checkInWashingGate);
router.post('/check_out_laundry', verifyJwtRoles([]), WashingsController.checkOutWashingGate);
router.post('/check_in_room', verifyJwtRoles([]), WashingsController.checkInRoom);

module.exports = router;