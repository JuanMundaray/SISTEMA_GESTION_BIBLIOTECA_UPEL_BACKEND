// routes/digitalResourceRoutes.js
const express = require('express');
const router = express.Router();
const digitalResourceController = require('../controllers/digitalResourceController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const digitalResourceSchema = require('../schema/digitalResourceSchema');

/**
 * @route GET /digital-resources
 * @desc Obtener todos los recursos digitales
 * @access Público
 */
router.get('/', digitalResourceController.getResources);

/**
 * @route GET /digital-resources/:id
 * @desc Obtener un recurso digital por ID
 * @access Público
 */
router.get('/:id', digitalResourceController.getResourceById);

/**
 * @route POST /digital-resources
 * @desc Crear un nuevo recurso digital
 * @access Admin (requiere autenticación)
 */
router.post('/', authenticateToken, requireAdmin, validate(digitalResourceSchema), digitalResourceController.createResource);

/**
 * @route PUT /digital-resources/:id
 * @desc Actualizar un recurso digital
 * @access Admin (requiere autenticación)
 */
router.put('/:id', authenticateToken, requireAdmin, validate(digitalResourceSchema), digitalResourceController.updateResource);

/**
 * @route DELETE /digital-resources/:id
 * @desc Eliminar un recurso digital
 * @access Admin (requiere autenticación)
 */
router.delete('/:id', authenticateToken, requireAdmin, digitalResourceController.deleteResource);

module.exports = router;