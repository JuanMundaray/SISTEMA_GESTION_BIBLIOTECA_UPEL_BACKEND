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
router.post('/', validate(registerSchema), userController.registerUser);
router.get('/', userController.getAllUsers);
router.get('/:ci', validate(ciParamSchema), userController.findByCiUser);
router.put('/:ci', userController.updateUser); // Puedes agregar validación si tienes un schema para update
router.delete('/:ci', requireAdmin, userController.deleteUser);
router.patch('/:ci/restore', userController.restoreUser);
router.get('/email/:email', validate(emailParamSchema), userController.findByEmailUser);

module.exports = router;