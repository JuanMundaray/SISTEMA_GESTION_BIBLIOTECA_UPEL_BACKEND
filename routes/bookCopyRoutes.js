// routes/bookCopyRoutes.js
const express = require('express');
const router = express.Router();
const controller = require('../controllers/bookCopyController');
const bookCopySchema = require('../schema/bookCopySchema');
const { validate } = require('../validators/validator');
const requireAdmin = require('../middlewares/requireAdmin');

/**
 * @route POST /book-copies
 * @desc Crear una nueva copia de libro
 * @access Admin
 */
router.post('/', requireAdmin, validate(bookCopySchema), controller.createBookCopy);

/**
 * @route GET /book-copies
 * @desc Obtener todas las copias de libros
 * @access Público
 */
router.get('/', controller.getAllBookCopies);

/**
 * @route GET /book-copies/:id
 * @desc Obtener una copia de libro por ID
 * @access Público
 */
router.get('/:id', controller.getBookCopyById);

/**
 * @route PUT /book-copies/:id
 * @desc Actualizar una copia de libro
 * @access Admin
 */
router.put('/:id', requireAdmin, controller.updateBookCopy);

/**
 * @route DELETE /book-copies/:id
 * @desc Eliminar una copia de libro
 * @access Admin
 */
router.delete('/:id', requireAdmin, controller.deleteBookCopy);

module.exports = router;
