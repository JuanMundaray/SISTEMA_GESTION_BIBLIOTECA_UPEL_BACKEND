// routes/Users.js
const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const registerSchema = require('../schema/registerSchema');
const loginSchema = require('../schema/loginSchema');
const { ciParamSchema, emailParamSchema } = require('../schema/paramUserSchemas');

/**
 * @route POST /login
 * @desc Iniciar sesión de usuario
 * @access Público
 */
router.post('/login', validate(loginSchema), userController.loginUser);

/**
 * @route POST /
 * @desc Registrar usuario
 * @access Admin
 */
router.post('/', validate(registerSchema), requireAdmin, userController.registerUser);

/**
 * @route GET /
 * @desc Obtener todos los usuarios
 * @access Admin
 */
router.get('/', requireAdmin, userController.getAllUsers);

/**
 * @route GET /:ci
 * @desc Buscar usuario por CI
 * @access Admin
 */
router.get('/:ci', validate(ciParamSchema), requireAdmin, userController.findByCiUser);

/**
 * @route PUT /:ci
 * @desc Actualizar usuario
 * @access Admin
 */
router.put('/:ci', requireAdmin, userController.updateUser);

/**
 * @route DELETE /:ci
 * @desc Eliminar usuario
 * @access Admin
 */
router.delete('/:ci', requireAdmin, userController.deleteUser);

/**
 * @route PATCH /:ci/restore
 * @desc Restaurar usuario eliminado
 * @access Admin
 */
router.patch('/:ci/restore', requireAdmin, userController.restoreUser);

/**
 * @route GET /email/:email
 * @desc Buscar usuario por email
 * @access Admin
 */
router.get('/email/:email', validate(emailParamSchema), requireAdmin, userController.findByEmailUser);

module.exports = router;