// routes/holdRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/holdController');

router.post('/', controller.createHold);
router.get('/', controller.getAllHolds);
router.get('/:id', controller.getHoldById);
router.put('/:id', controller.updateHold);
router.delete('/:id', controller.deleteHold);

module.exports = router;
