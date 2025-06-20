// routes/holdRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/holdController');
const { validate } = require('../validators/validator');
const holdSchema = require('../schema/holdSchema');

router.post('/', validate(holdSchema), controller.createHold);
router.get('/', controller.getAllHolds);
router.get('/:id', controller.getHoldById);
router.put('/:id', validate(holdSchema), controller.updateHold);
router.delete('/:id', controller.deleteHold);

module.exports = router;
