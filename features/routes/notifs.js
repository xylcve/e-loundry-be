const express = require('express');
const router = express.Router();
const NotificationController = require('../controllers/notifs.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/havent_wash', verifyJwtRoles([]), NotificationController.HaventDoneWashingInCertainDays);

module.exports = router;