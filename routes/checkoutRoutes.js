// routes/checkoutRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/checkoutController');
const { validate } = require('../validators/validator');
const checkoutSchema = require('../schema/checkoutSchema');

router.post('/', validate(checkoutSchema), controller.createCheckout);
router.get('/', controller.getAllCheckouts);
router.get('/full', controller.getAllCheckoutsJoinCopyJoinUser);
router.get('/full/:id', controller.getCheckoutFullById);
router.get('/:id', controller.getCheckoutById);
router.put('/:id', controller.updateCheckout);
router.delete('/:id', controller.deleteCheckout);
router.get('/user/:user_id', controller.getCheckoutsByUserId);
router.get('/copy/:copy_id', controller.getCheckoutsByCopyId);
router.put('/:id/return', controller.processReturn);

module.exports = router;
