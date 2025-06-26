// routes/Users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const registerSchema = require('../schema/registerSchema');
const loginSchema = require('../schema/loginSchema');
const { ciParamSchema, emailParamSchema } = require('../schema/paramUserSchemas');

router.post('/login', validate(loginSchema), userController.loginUser);
router.post('/', validate(registerSchema), requireAdmin,userController.registerUser);
router.get('/', requireAdmin, userController.getAllUsers);
router.get('/:ci', validate(ciParamSchema), requireAdmin ,userController.findByCiUser);
router.put('/:ci', requireAdmin,userController.updateUser);
router.delete('/:ci', requireAdmin, userController.deleteUser);
router.patch('/:ci/restore', requireAdmin, userController.restoreUser);
router.get('/email/:email', validate(emailParamSchema), requireAdmin ,userController.findByEmailUser);

module.exports = router;