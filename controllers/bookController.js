// controllers/libroController.js
const book = require('../models/bookModel');

/**
 * Crea un nuevo libro en la base de datos.
 * @route POST /api/book
 * @param {Object} req - Objeto de solicitud Express con los datos del libro en el body
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 201 - Libro creado exitosamente
 * @returns {Object} 400 - Error de validación o ISBN duplicado
 */
const createBook = async (req, res) => {
  try {
    const { isbn, title, author, publisher, publication_year, category, edition, description, is_available, cover_url } = req.body;
    
    // Validación básica
    if (!isbn || !title || !author || !category) {
      return res.status(400).json({ error: 'Faltan campos obligatorios (isbn, title, author, category)' });
    }

    const nuevoLibro = await book.create({
      isbn,
      title,
      author,
      publisher,
      publication_year,
      category,
      edition,
      description,
      is_available,
      cover_url
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

/**
 * Obtiene todos los libros, con paginación opcional.
 * @route GET /api/book
 * @param {Object} req - Objeto de solicitud Express (puede incluir page y limit en query)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 200 - Lista de libros (paginada o completa)
 */
const getAllBooks = async (req, res) => {
  try {
    const page = req.query.page ? parseInt(req.query.page) : undefined;
    const limit = req.query.limit ? parseInt(req.query.limit) : undefined;
    let result;
    if (typeof page === 'number' && typeof limit === 'number') {
      const offset = (page - 1) * limit;
      result = await book.findAll({ limit, offset });
      res.json({
        books: result.books,
        pagination: {
          total: result.total,
          page,
          pages: Math.ceil(result.total / limit),
          limit
        }
      });
    } else {
      const books = await book.findAll();
      res.json(books);
    }
  } catch (error) {
    console.error('Error al obtener libros:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Busca un libro por su ISBN.
 * @route GET /api/book/:isbn
 * @param {Object} req - Objeto de solicitud Express (params: isbn)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 200 - Libro encontrado
 * @returns {Object} 404 - Libro no encontrado
 */
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

/**
 * Busca libros por título (búsqueda parcial).
 * @route GET /api/book/:title
 * @param {Object} req - Objeto de solicitud Express (params: title)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 200 - Libros encontrados
 * @returns {Object} 404 - Libro no encontrado
 */
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

/**
 * Actualiza los datos de un libro existente.
 * @route PUT /api/book/:id
 * @param {Object} req - Objeto de solicitud Express (params: id, body: datos a actualizar)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 200 - Libro actualizado
 * @returns {Object} 404 - Libro no encontrado
 */
const updateBook = async (req, res) => {
  try {
    const { id } = req.params;
    // Tomar todos los campos enviados en el body (actualización parcial)
    const fields = req.body;
    if (!fields || Object.keys(fields).length === 0) {
      return res.status(400).json({ error: 'No se enviaron datos para actualizar.' });
    }
    const result = await book.update(id, fields);
    if (result && result.error) {
      return res.status(400).json({ error: result.error });
    }
    if (!result) {
      return res.status(404).json({ error: 'Libro no encontrado o sin campos válidos para actualizar.' });
    }
    res.json(result);
  } catch (error) {
    console.error('Error al actualizar libro:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

/**
 * Elimina un libro de la base de datos.
 * @route DELETE /api/book/:id
 * @param {Object} req - Objeto de solicitud Express (params: id)
 * @param {Object} res - Objeto de respuesta Express
 * @returns {Object} 200 - Libro eliminado correctamente
 * @returns {Object} 404 - Libro no encontrado
 */

const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;
    const libroEliminado = await book.delete(id);

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