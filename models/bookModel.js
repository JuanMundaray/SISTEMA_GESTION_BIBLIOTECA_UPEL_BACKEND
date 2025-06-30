// models/bookModel.js
const pool = require('../config/db');

const Book = {
  // Crear un libro
  async create({ isbn, title, author, publisher, publication_year, category, edition, description, is_available, cover_url }) {
    const result = await pool.query(
      `
        INSERT INTO upel_library.books (isbn, title, author, publisher, publication_year, category, edition, description, is_available, cover_url)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
        RETURNING *;
      `,
      [isbn, title, author, publisher, publication_year, category, edition, description, is_available, cover_url]
    );
    return result.rows[0];
  },

  // Obtener todos los libros, opcionalmente paginados
  async findAll({ limit, offset } = {}) {
    if (typeof limit === 'number' && typeof offset === 'number') {
      const result = await pool.query(
        'SELECT * FROM upel_library.books ORDER BY book_id LIMIT $1 OFFSET $2',
        [limit, offset]
      );
      const countResult = await pool.query('SELECT COUNT(*) FROM upel_library.books');
      return {
        books: result.rows,
        total: parseInt(countResult.rows[0].count, 10)
      };
    } else {
      const result = await pool.query('SELECT * FROM upel_library.books ORDER BY book_id');
      return result.rows;
    }
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

  // Actualizar un libro (actualización parcial)
  async update(book_id, fields) {
    // Filtrar solo los campos definidos
    const allowedFields = [
      'title', 'author', 'publisher', 'publication_year', 'category', 'edition', 'description', 'is_available', 'cover_url'
    ];
    const updates = [];
    const values = [];
    let idx = 1;
    const invalidFields = Object.keys(fields).filter(key => !allowedFields.includes(key));
    if (invalidFields.length > 0) {
      // Si hay campos inválidos, devolver error
      return { error: `Campos no válidos: ${invalidFields.join(', ')}` };
    }
    for (const key of allowedFields) {
      if (fields[key] !== undefined) {
        updates.push(`${key} = $${idx}`);
        values.push(fields[key]);
        idx++;
      }
    }
    if (updates.length === 0) {
      // No hay campos para actualizar
      return null;
    }
    // Siempre actualiza updated_at
    updates.push(`updated_at = NOW()`);
    const query = `
      UPDATE upel_library.books
      SET ${updates.join(', ')}
      WHERE book_id = $${idx}
      RETURNING *;
    `;
    values.push(book_id);
    const result = await pool.query(query, values);
    return result.rows[0];
  },

  // Eliminar un libro
  async delete(book_id) {
    const result = await pool.query('DELETE FROM upel_library.books WHERE book_id = $1 RETURNING *', [book_id]);
    return result.rows[0];
  },
};

module.exports = Book;