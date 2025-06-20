// models/bookModel.js
const pool = require('../config/db');

const Book = {
  // Crear un libro
  async create({ isbn, title, author, publisher, publication_year, category, edition, is_available, cover_url }) {
    const result = await pool.query(
      `
        INSERT INTO upel_library.books (isbn, title, author, publisher, publication_year, category, edition, is_available, cover_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        RETURNING *;
      `,
      [isbn, title, author, publisher, publication_year, category, edition, is_available, cover_url]
    );
    return result.rows[0];
  },

  // Obtener todos los libros
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.books');
    return result.rows;
  },

  // Buscar por ID
  async findById(book_id) {
    const result = await pool.query('SELECT * FROM upel_library.books WHERE book_id = $1', [book_id]);
    return result.rows[0];
  },

  // Buscar por ISBN
  async findByISBN(isbn) {
    const result = await pool.query('SELECT * FROM upel_library.books WHERE isbn = $1', [isbn]);
    return result.rows[0];
  },

  // Actualizar un libro
  async update(book_id, { title, author, publisher, publication_year, category, edition, is_available, cover_url }) {
    const result = await pool.query(
      `
        UPDATE upel_library.books
        SET title = $1, author = $2, publisher = $3, publication_year = $4, category = $5, edition = $6, is_available = $7, cover_url = $8, updated_at = NOW()
        WHERE book_id = $9
        RETURNING *;
      `,
      [title, author, publisher, publication_year, category, edition, is_available, cover_url, book_id]
    );
    return result.rows[0];
  },

  // Eliminar un libro
  async delete(book_id) {
    const result = await pool.query('DELETE FROM upel_library.books WHERE book_id = $1 RETURNING *', [book_id]);
    return result.rows[0];
  },
};

module.exports = Book;