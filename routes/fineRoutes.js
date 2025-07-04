// routes/fineRoutes.js
const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const fineSchema = require('../schema/fineSchema');
const RequireAdmin = require('../middlewares/requireAdmin');

router.use(RequireAdmin);

/**
 * @route GET /fines
 * @desc Obtener todas las multas
 * @access Admin
 */
router.get('/', fineController.getFines);

/**
 * @route GET /fines/:id
 * @desc Obtener una multa por ID
 * @access Admin
 */
router.get('/:id', fineController.getFineById);

/**
 * @route GET /fines/full/:id
 * @desc Obtener todos los datos completos de una multa por su ID (incluye usuario y préstamo)
 * @access Admin
 */
router.get('/full/:id', fineController.getFineFullById);

/**
 * @route POST /fines
 * @desc Crear una nueva multa
 * @access Admin (requiere autenticación)
 */
router.post('/', authenticateToken, requireAdmin, validate(fineSchema), fineController.createFine);

/**
 * @route PUT /fines/:id
 * @desc Actualizar una multa
 * @access Admin (requiere autenticación)
 */
router.put('/:id', authenticateToken, requireAdmin, fineController.updateFine);

/**
 * @route DELETE /fines/:id
 * @desc Eliminar una multa
 * @access Admin (requiere autenticación)
 */
router.delete('/:id', authenticateToken, requireAdmin, fineController.deleteFine);

module.exports = router;
