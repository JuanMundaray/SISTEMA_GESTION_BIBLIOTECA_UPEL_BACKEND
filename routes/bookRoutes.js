// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validate } = require('../validators/validator');
const bookSchema = require('../schema/bookSchema');
const requireAdmin = require('../middlewares/requireAdmin');

/**
 * @route POST /books
 * @desc Crear un nuevo libro
 * @access Admin
 */
router.post('/', requireAdmin, validate(bookSchema), bookController.createBook);

/**
 * @route GET /books
 * @desc Obtener todos los libros
 * @access Público
 */
router.get('/', bookController.getAllBooks);

/**
 * @route GET /books/:isbn
 * @desc Buscar libro por ISBN
 * @access Público
 */
router.get('/:isbn', bookController.getBookISBN);

/**
 * @route GET /books/:title
 * @desc Buscar libro por título
 * @access Público
 */
router.get('/:title', bookController.getBookTitle);

/**
 * @route PUT /books/:id
 * @desc Actualizar libro
 * @access Admin
 */
router.put('/:id', requireAdmin, bookController.updateBook);

/**
 * @route DELETE /books/:id
 * @desc Eliminar libro
 * @access Admin
 */
router.delete('/:id', requireAdmin, bookController.deleteBook);

module.exports = router;