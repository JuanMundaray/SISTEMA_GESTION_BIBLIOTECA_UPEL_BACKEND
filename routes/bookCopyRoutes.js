// routes/bookCopyRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookCopyController');
const bookCopySchema = require('../schema/bookCopySchema');
const { validate } = require('../validators/validator');
const requireAdmin = require('../middlewares/requireAdmin');

router.post('/', requireAdmin, validate(bookCopySchema), controller.createBookCopy);
router.get('/', controller.getAllBookCopies);
router.get('/:id', controller.getBookCopyById);
router.put('/:id', requireAdmin, controller.updateBookCopy);
router.delete('/:id', requireAdmin, controller.deleteBookCopy);

module.exports = router;
