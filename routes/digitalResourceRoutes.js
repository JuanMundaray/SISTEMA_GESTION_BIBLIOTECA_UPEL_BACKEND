// routes/digitalResourceRoutes.js
const express = require('express');
const router = express.Router();
const digitalResourceController = require('../controllers/digitalResourceController');
const authenticateToken = require('../middlewares/authenticateToken');
const requireAdmin = require('../middlewares/requireAdmin');

// Public: List all digital resources
router.get('/', digitalResourceController.getResources);
// Public: Get digital resource by ID
router.get('/:id', digitalResourceController.getResourceById);
// Protected: Create digital resource (admin only)
router.post('/', authenticateToken, requireAdmin, digitalResourceController.createResource);
// Protected: Update digital resource (admin only)
router.put('/:id', authenticateToken, requireAdmin, digitalResourceController.updateResource);
// Protected: Delete digital resource (admin only)
router.delete('/:id', authenticateToken, requireAdmin, digitalResourceController.deleteResource);

module.exports = router;
