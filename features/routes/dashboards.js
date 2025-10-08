const express = require('express');
const router = express.Router();
const DashboardController = require('../controllers/dashboards.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/by_expiry', verifyJwtRoles([]), DashboardController.GetMaxWashedLinen);
router.get('/by_status', verifyJwtRoles([]), DashboardController.GetLinenByStatus);
router.get('/by_room/asc', verifyJwtRoles([]), DashboardController.GetLinenByRoomAsc);
router.get('/by_room/desc', verifyJwtRoles([]), DashboardController.GetLinenByRoomDesc);

module.exports = router;