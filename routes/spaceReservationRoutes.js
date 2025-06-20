// routes/spaceReservationRoutes.js
const express = require('express');
const router = express.Router();
const spaceReservationController = require('../controllers/spaceReservationController');
const authenticateToken = require('../middlewares/authenticateToken');
const { validate } = require('../validators/validator');
const spaceReservationSchema = require('../schema/spaceReservationSchema');

// Public: List all reservations
router.get('/', spaceReservationController.getReservations);
// Public: Get reservation by ID
router.get('/:id', spaceReservationController.getReservationById);
// Protected: Create reservation (authenticated users)
router.post('/', authenticateToken, validate(spaceReservationSchema), spaceReservationController.createReservation);
// Protected: Update reservation (authenticated users)
router.put('/:id', authenticateToken, validate(spaceReservationSchema), spaceReservationController.updateReservation);
// Protected: Delete reservation (authenticated users)
router.delete('/:id', authenticateToken, spaceReservationController.deleteReservation);

module.exports = router;
