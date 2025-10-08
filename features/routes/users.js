const express = require('express');
const router = express.Router();
const UsersController = require('../controllers/users.js');
const { verifyJwtRoles } = require('../../middleware/verify_jwt.js');
const { authLimiter, limiter } = require('../../middleware/rate_limiter.js');

router.use(authLimiter)
router.post('/auth', UsersController.auth);

router.use(limiter)
router.post('/refresh', [verifyJwtRoles([])], UsersController.refreshToken);
router.get('/', [verifyJwtRoles([])], UsersController.getUsers);
router.get('/roles', [verifyJwtRoles([])], UsersController.getRoles);
router.post('/add', [verifyJwtRoles(["Admin"])], UsersController.createUsers);
router.put('/update', [verifyJwtRoles(["Admin"])], UsersController.updateUsers);
router.delete('/delete', [verifyJwtRoles(["Admin"])], UsersController.deleteUsers);

module.exports = router;