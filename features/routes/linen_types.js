const express = require('express');
const router = express.Router();
const LinenTypesController = require('../controllers/linen_types.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { limiter } = require('../../middleware/rate_limiter.js');

router.use(limiter)
router.get('/', verifyJwtRoles([]), LinenTypesController.getLinenTypes);
router.post('/add', verifyJwtRoles([]), LinenTypesController.createLinenTypes);
router.put('/update', verifyJwtRoles([]), LinenTypesController.updateLinenTypes);
router.delete('/delete', verifyJwtRoles([]), LinenTypesController.deleteLinenTypes);

module.exports = router;