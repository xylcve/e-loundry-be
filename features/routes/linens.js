const express = require('express');
const router = express.Router();
const LinensController = require('../controllers/linens.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/', verifyJwtRoles([]), LinensController.getLinens);
router.get('/by_room', verifyJwtRoles([]), LinensController.getLinensByRoom);
router.post('/add', verifyJwtRoles([]), LinensController.createLinens);
router.put('/update', verifyJwtRoles([]), LinensController.updateLinens);
router.put('/disable', verifyJwtRoles([]), LinensController.disableLinens);
router.put('/change_rfid', verifyJwtRoles([]), LinensController.changeRfidLinen);

module.exports = router;