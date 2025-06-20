// controllers/libroController.js
const book = require('../models/bookModel');

/**
 * Crea un nuevo libro.
 * @route POST /api/book
 * @param {Object} req - Objeto de solicitud Express
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 201 - Libro creado exitosamente
 * @returns {Object} 400 - Error de validación o ISBN duplicado
 */
const createBook = async (req, res) => {
  try {
    const { name, author, isbn, editorial, publication_year } = req.body;
    
    // Validación básica
    if (!name || !author || !isbn) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (name, author, isbn)' });
    }

    const nuevoLibro = await book.create({
      name,
      author,
      isbn,
      editorial,
      publication_year
    });

    res.status(201).json(nuevoLibro);
  } catch (error) {
    if (error.code === '23505') { // Violación de unique constraint (ISBN duplicado)
      res.status(400).json({ error: 'El ISBN ya existe en la base de datos' });
    } else {
      console.error('Error al crear libro:', error);
      res.status(500).json({ error: 'Error interno del servidor' });
    }
  }
};

const getAllBooks = async (req, res) => {
  try {
    const libros = await book.findAll();
    res.json(libros);
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getBookISBN = async (req, res) => {
  try {
    const { isbn } = req.params;
    const libro = await book.findByISBN(isbn);

    if (!libro) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libro);
  } catch (error) {
    console.error('Error al buscar libro por ISBN:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const getBookTitle = async (req, res) => {
  try {
    const { titulo } = req.query;
    
    if (!titulo) {
      return res.status(400).json({ error: 'Parámetro "titulo" requerido' });
    }

    const libros = await book.searchByTitle(titulo);
    res.json(libros);
  } catch (error) {
    console.error('Error al buscar libros por título:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    const { available } = req.body;

    if (typeof available !== 'boolean') {
      return res.status(400).json({ error: 'El campo "available" debe ser booleano' });
    }

    const libroActualizado = await bookupdateAvailability(id, available);
    
    if (!libroActualizado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json(libroActualizado);
  } catch (error) {
    console.error('Error al actualizar disponibilidad:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const libroEliminado = await bookdelete(id);

    if (!libroEliminado) {
      return res.status(404).json({ error: 'Libro no encontrado' });
    }

    res.json({ message: 'Libro eliminado correctamente', libro: libroEliminado });
  } catch (error) {
    console.error('Error al eliminar libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

module.exports = {
  createBook,
  getAllBooks,
  getBookISBN,
  getBookTitle,
  updateBook,
  deleteBook
};