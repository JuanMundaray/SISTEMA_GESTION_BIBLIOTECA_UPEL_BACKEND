// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/checkoutController');
const { validate } = require('../validators/validator');
const checkoutSchema = require('../schema/checkoutSchema');

router.post('/', validate(checkoutSchema), controller.createCheckout);
router.get('/', controller.getAllCheckouts);
router.get('/:id', controller.getCheckoutById);
router.put('/:id', validate(checkoutSchema), controller.updateCheckout);
router.delete('/:id', controller.deleteCheckout);

module.exports = router;
