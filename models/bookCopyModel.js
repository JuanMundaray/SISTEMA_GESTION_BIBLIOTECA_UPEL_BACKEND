// models/bookCopyModel.js
const pool = require('../config/db');

const BookCopy = {
  async create({ book_id, barcode, location, status }) {
    const result = await pool.query(
      `INSERT INTO copies (book_id, barcode, location, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [book_id, barcode, location, status]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM copies');
    return result.rows;
  },
  async findById(copy_id) {
    const result = await pool.query('SELECT * FROM copies WHERE copy_id = $1', [copy_id]);
    return result.rows[0];
  },
  async update(copy_id, { location, status }) {
    const result = await pool.query(
      `UPDATE copies SET location = $1, status = $2, updated_at = NOW() WHERE copy_id = $3 RETURNING *`,
      [location, status, copy_id]
    );
    return result.rows[0];
  },
  async delete(copy_id) {
    const result = await pool.query('DELETE FROM copies WHERE copy_id = $1 RETURNING *', [copy_id]);
    return result.rows[0];
  }
};

module.exports = BookCopy;
