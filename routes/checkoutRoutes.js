// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/checkoutController');

router.post('/', controller.createCheckout);
router.get('/', controller.getAllCheckouts);
router.get('/:id', controller.getCheckoutById);
router.put('/:id', controller.updateCheckout);
router.delete('/:id', controller.deleteCheckout);

module.exports = router;
