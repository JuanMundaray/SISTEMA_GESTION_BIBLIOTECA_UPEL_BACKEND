// models/digitalResourceModel.js
const pool = require('../config/db');

const DigitalResource = {
  async create({ book_id, title, author, url, type, upload_date }) {
    const result = await pool.query(
      `INSERT INTO upel_library.digital_resources (book_id, title, author, url, type, upload_date) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [book_id, title, author, url, type, upload_date]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.digital_resources');
    return result.rows;
  },
  async findById(resource_id) {
    const result = await pool.query('SELECT * FROM upel_library.digital_resources WHERE resource_id = $1', [resource_id]);
    return result.rows[0];
  },
  async update(resource_id, { book_id, title, author, url, type, upload_date }) {
    const result = await pool.query(
      `UPDATE upel_library.digital_resources SET book_id = $1, title = $2, author = $3, url = $4, type = $5, upload_date = $6, updated_at = NOW() WHERE resource_id = $7 RETURNING *`,
      [book_id, title, author, url, type, upload_date, resource_id]
    );
    return result.rows[0];
  },
  async delete(resource_id) {
    const result = await pool.query('DELETE FROM upel_library.digital_resources WHERE resource_id = $1 RETURNING *', [resource_id]);
    return result.rows[0];
  }
};

module.exports = DigitalResource;
