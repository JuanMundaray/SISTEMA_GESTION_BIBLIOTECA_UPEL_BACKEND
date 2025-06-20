// models/digitalResourceModel.js
const pool = require('../config/db');

const DigitalResource = {
  async create({ title, url, description, type }) {
    const result = await pool.query(
      `INSERT INTO digital_resources (title, url, description, type) VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, url, description, type]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM digital_resources');
    return result.rows;
  },
  async findById(resource_id) {
    const result = await pool.query('SELECT * FROM digital_resources WHERE resource_id = $1', [resource_id]);
    return result.rows[0];
  },
  async update(resource_id, { title, url, description, type }) {
    const result = await pool.query(
      `UPDATE digital_resources SET title = $1, url = $2, description = $3, type = $4, updated_at = NOW() WHERE resource_id = $5 RETURNING *`,
      [title, url, description, type, resource_id]
    );
    return result.rows[0];
  },
  async delete(resource_id) {
    const result = await pool.query('DELETE FROM digital_resources WHERE resource_id = $1 RETURNING *', [resource_id]);
    return result.rows[0];
  }
};

module.exports = DigitalResource;
