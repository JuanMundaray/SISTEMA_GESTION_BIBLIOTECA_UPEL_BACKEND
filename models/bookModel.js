// models/Libro.js
const pool = require('../config/db');

const Libro = {
  // Crear un libro
  async create({ name, author, isbn, editorial, publication_year }) {
    const query = {
      text: `
        INSERT INTO libros (title, autor, isbn, editorial, publication_year, available)
        VALUES ($1, $2, $3, $4, $5, $6)
        RETURNING *;
      `,
      values: [name, author, isbn, editorial, publication_year, true],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  // Obtener todos los libros
  async findAll() {
    const { rows } = await pool.query('SELECT * FROM libros;');
    return rows;
  },

  // Buscar por ISBN
  async findByISBN(isbn) {
    const query = {
      text: 'SELECT * FROM libros WHERE isbn = $1;',
      values: [isbn],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },

  // Actualizar disponibilidad
  async updateDisponibilidad(id, disponible) {
    const query = {
      text: 'UPDATE libros SET disponible = $1 WHERE id = $2 RETURNING *;',
      values: [disponible, id],
    };
    const { rows } = await pool.query(query);
    return rows[0];
  },
};

module.exports = Libro;