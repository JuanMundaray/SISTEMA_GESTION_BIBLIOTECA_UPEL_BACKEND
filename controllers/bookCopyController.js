const BookCopy = require('../models/bookCopyModel');

const createBookCopy = async (req, res) => {
  try {
    const { book_id, barcode, location, status } = req.body;
    const copy = await BookCopy.create({ book_id, barcode, location, status });
    res.status(201).json(copy);
  } 
  catch (error) {
    if (error.code === '23503') {
      // Violación de clave foránea: el libro no existe
      return res.status(404).json({ error: 'No existe un libro con ese ID' });
    }
    if (error.code === '23505') {
      // Violación de clave única: el código de barras ya existe
      return res.status(400).json({ error: 'El código de barras ya existe' });
    }
    res.status(500).json(
      {
        error: 'Error al crear la copia del libro',
        details: error.message
    });
  }
};

const getAllBookCopies = async (req, res) => {
  try {
    const copies = await BookCopy.findAll();
    res.json(copies);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las copias de libros' });
  }
};

const getBookCopyById = async (req, res) => {
  try {
    const { id } = req.params;
    const copy = await BookCopy.findById(id);
    if (!copy) return res.status(404).json({ error: 'Copia no encontrada' });
    res.json(copy);
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener la copia del libro' });
  }
};

const updateBookCopy = async (req, res) => {
  try {
    const { id } = req.params;
    const { location, status } = req.body;
    const copy = await BookCopy.update(id, { location, status });
    if (!copy) return res.status(404).json({ error: 'Copia no encontrada' });
    res.json(copy);
  } catch (error) {
    if (error.code === '23514') {
      return res.status(400).json({ error: 'Los únicos estados disponibles para un libro son: available, checked_out, under_maintenance' });
    }
    res.status(500).json(
      {
        error: 'Error al actualizar la copia del libro',
        details: error.message,
        code: error.code
    });
  }
};

const deleteBookCopy = async (req, res) => {
  try {
    const { id } = req.params;
    const copy = await BookCopy.delete(id);
    if (!copy) return res.status(404).json({ error: 'Copia no encontrada' });
    res.json({ message: 'Copia eliminada', copy });
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la copia del libro' });
  }
};

module.exports = {
  createBookCopy,
  getAllBookCopies,
  getBookCopyById,
  updateBookCopy,
  deleteBookCopy
};
