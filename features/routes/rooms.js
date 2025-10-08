const express = require('express');
const router = express.Router();
const RoomsController = require('../controllers/rooms.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/', verifyJwtRoles([]), RoomsController.getRooms);
router.get('/types', verifyJwtRoles([]), RoomsController.getRoomTypes);
router.post('/add', verifyJwtRoles([]), RoomsController.createRooms);
router.put('/update', verifyJwtRoles([]), RoomsController.updateRooms);
router.delete('/delete', verifyJwtRoles([]), RoomsController.deleteRooms);

module.exports = router;