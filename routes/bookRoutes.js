// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validate } = require('../validators/validator');
const bookSchema = require('../schema/bookSchema');
const requireAdmin = require('../middlewares/requireAdmin');


// CRUD de books
router.post('/', requireAdmin, validate(bookSchema), bookController.createBook);          // Crear book
router.get('/', bookController.getAllBooks);      // Obtener todos
router.get('/:isbn', bookController.getBookISBN);  // Buscar por ISBN
router.get('/:title', bookController.getBookTitle);    // Buscar por Titulo
router.put('/:id', requireAdmin, bookController.updateBook);   // Actualizar
router.delete('/:id', requireAdmin, bookController.deleteBook);  // Eliminar

module.exports = router;