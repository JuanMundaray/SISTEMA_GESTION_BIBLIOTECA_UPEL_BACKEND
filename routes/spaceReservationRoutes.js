// routes/spaceReservationRoutes.js
const express = require('express');
const router = express.Router();
const spaceReservationController = require('../controllers/spaceReservationController');
const authenticateToken = require('../middlewares/authenticateToken');
const { validate } = require('../validators/validator');

const {
    spaceReservationSchema,
    spaceReservationUpdateSchema
} = require('../schema/spaceReservationSchema');

/**
 * @route GET /space-reservations
 * @desc Obtener todas las reservas de espacios
 * @access Público
 */
router.get('/', spaceReservationController.getReservations);

/**
 * @route GET /space-reservations/:id
 * @desc Obtener una reserva de espacio por ID
 * @access Público
 */
router.get('/:id', spaceReservationController.getReservationById);

/**
 * @route POST /space-reservations
 * @desc Crear una nueva reserva de espacio
 * @access Usuario autenticado
 */
router.post('/', authenticateToken, validate(spaceReservationSchema), spaceReservationController.createReservation);

/**
 * @route PUT /space-reservations/:id
 * @desc Actualizar una reserva de espacio
 * @access Usuario autenticado
 */
router.put('/:id', authenticateToken, validate(spaceReservationUpdateSchema), spaceReservationController.updateReservation);

/**
 * @route DELETE /space-reservations/:id
 * @desc Eliminar una reserva de espacio
 * @access Usuario autenticado
 */
router.delete('/:id', authenticateToken, spaceReservationController.deleteReservation);

module.exports = router;
