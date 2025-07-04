// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/checkoutController');
const { validate } = require('../validators/validator');
const checkoutSchema = require('../schema/checkoutSchema');
const RequireAdmin = require('../middlewares/requireAdmin');

// Aplica el middleware RequireAdmin a todas las rutas de este router
router.use(RequireAdmin);

/**
 * @route POST /
 * @desc Crear un nuevo registro de préstamo
 * @access Admin
 */
router.post('/', validate(checkoutSchema), controller.createCheckout);

/**
 * @route GET /
 * @desc Obtener todos los registros de préstamos
 * @access Admin
 */
router.get('/', controller.getAllCheckouts);

/**
 * @route GET /full
 * @desc Obtener todos los préstamos con información de copia y usuario
 * @access Admin
 */
router.get('/full', controller.getAllCheckoutsJoinCopyJoinUser);

/**
 * @route GET /full/:id
 * @desc Obtener un préstamo completo por ID (con datos de copia del libro y usuario)
 * @access Admin
 */
router.get('/full/:id', controller.getCheckoutFullById);

/**
 * @route GET /:id
 * @desc Obtener un préstamo por ID
 * @access Admin
 */
router.get('/:id', controller.getCheckoutById);

/**
 * @route PUT /:id
 * @desc Actualizar un préstamo por ID
 * @access Admin
 */
router.put('/:id', controller.updateCheckout);

/**
 * @route DELETE /:id
 * @desc Eliminar un préstamo por ID
 * @access Admin
 */
router.delete('/:id', controller.deleteCheckout);

/**
 * @route GET /user/:user_id
 * @desc Obtener todos los préstamos de un usuario
 * @access Admin
 */
router.get('/user/:user_id', controller.getCheckoutsByUserId);

/**
 * @route GET /copy/:copy_id
 * @desc Obtener todos los préstamos de una copia de libro
 * @access Admin
 */
router.get('/copy/:copy_id', controller.getCheckoutsByCopyId);

/**
 * @route PUT /:id/return
 * @desc Procesar la devolución de un préstamo
 * @access Admin
 */
router.put('/:id/return', controller.processReturn);

module.exports = router;
