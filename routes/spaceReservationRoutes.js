// routes/spaceReservationRoutes.js
const express = require('express');
const router = express.Router();
const spaceReservationController = require('../controllers/spaceReservationController');
const authenticateToken = require('../middlewares/authenticateToken');

// Public: List all reservations
router.get('/', spaceReservationController.getReservations);
// Public: Get reservation by ID
router.get('/:id', spaceReservationController.getReservationById);
// Protected: Create reservation (authenticated users)
router.post('/', authenticateToken, spaceReservationController.createReservation);
// Protected: Update reservation (authenticated users)
router.put('/:id', authenticateToken, spaceReservationController.updateReservation);
// Protected: Delete reservation (authenticated users)
router.delete('/:id', authenticateToken, spaceReservationController.deleteReservation);

module.exports = router;
