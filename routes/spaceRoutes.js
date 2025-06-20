// routes/spaceRoutes.js
const express = require('express');
const router = express.Router();
const spaceController = require('../controllers/spaceController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');
const { validate } = require('../validators/validator');
const spaceSchema = require('../schema/spaceSchema');

// Public: List all spaces
router.get('/', spaceController.getSpaces);
// Public: Get space by ID
router.get('/:id', spaceController.getSpaceById);
// Protected: Create space (admin only)
router.post('/', authenticateToken, requireAdmin, validate(spaceSchema), spaceController.createSpace);
// Protected: Update space (admin only)
router.put('/:id', authenticateToken, requireAdmin, validate(spaceSchema), spaceController.updateSpace);
// Protected: Delete space (admin only)
router.delete('/:id', authenticateToken, requireAdmin, spaceController.deleteSpace);

module.exports = router;
