// routes/books.js
const express = require('express');
const router = express.Router();
const bookController = require('../controllers/bookController');
const { validate } = require('../validators/validator');
const bookSchema = require('../schema/bookSchema');


// CRUD de books
router.post('/',validate(bookSchema), bookController.createBook);          // Crear book
router.get('/', bookController.getAllBooks);        // Obtener todos
router.get('/:isbn', bookController.getBookISBN);    // Buscar por ISBN
router.get('/:title', bookController.getBookTitle);    // Buscar por ISBN
router.put('/:id', bookController.updateBook);   // Actualizar
router.delete('/:id', bookController.deleteBook);  // Eliminar

module.exports = router;