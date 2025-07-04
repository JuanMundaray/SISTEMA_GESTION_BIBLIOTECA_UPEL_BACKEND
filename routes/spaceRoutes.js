// routes/spaceRoutes.js
const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const spaceSchema = require('../schema/spaceSchema');

/**
 * @route GET /spaces
 * @desc Obtener todos los espacios
 * @access Público
 */
router.get('/', spaceController.getSpaces);

/**
 * @route GET /spaces/:id
 * @desc Obtener un espacio por ID
 * @access Público
 */
router.get('/:id', spaceController.getSpaceById);

/**
 * @route POST /spaces
 * @desc Crear un nuevo espacio
 * @access Admin (requiere autenticación)
 */
router.post('/', authenticateToken, requireAdmin, validate(spaceSchema), spaceController.createSpace);

/**
 * @route PUT /spaces/:id
 * @desc Actualizar un espacio
 * @access Admin (requiere autenticación)
 */
router.put('/:id', authenticateToken, requireAdmin, validate(spaceSchema), spaceController.updateSpace);

/**
 * @route DELETE /spaces/:id
 * @desc Eliminar un espacio
 * @access Admin (requiere autenticación)
 */
router.delete('/:id', authenticateToken, requireAdmin, spaceController.deleteSpace);

module.exports = router;
