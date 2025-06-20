// routes/fineRoutes.js
const express = require('express');
const router = express.Router();
const fineController = require('../controllers/fineController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const fineSchema = require('../schema/fineSchema');

// Public: List all fines
router.get('/', fineController.getFines);
// Public: Get fine by ID
router.get('/:id', fineController.getFineById);
// Protected: Create fine (admin only)
router.post('/', authenticateToken, requireAdmin, validate(fineSchema), fineController.createFine);
// Protected: Update fine (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(fineSchema), fineController.updateFine);
// Protected: Delete fine (admin only)
router.delete('/:id', authenticateToken, requireAdmin, fineController.deleteFine);

module.exports = router;
