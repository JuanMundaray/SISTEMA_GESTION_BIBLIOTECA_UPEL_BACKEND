// routes/bookCopyRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookCopyController');

router.post('/', controller.createBookCopy);
router.get('/', controller.getAllBookCopies);
router.get('/:id', controller.getBookCopyById);
router.put('/:id', controller.updateBookCopy);
router.delete('/:id', controller.deleteBookCopy);

module.exports = router;
