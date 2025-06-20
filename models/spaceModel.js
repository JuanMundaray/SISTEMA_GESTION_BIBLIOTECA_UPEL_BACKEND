// models/spaceModel.js
const pool = require('../config/db');

const Space = {
  async create({ name, capacity, type }) {
    const result = await pool.query(
      `INSERT INTO upel_library.spaces (name, capacity, type) VALUES ($1, $2, $3) RETURNING *`,
      [name, capacity, type]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.spaces');
    return result.rows;
  },
  async findById(space_id) {
    const result = await pool.query('SELECT * FROM upel_library.spaces WHERE space_id = $1', [space_id]);
    return result.rows[0];
  },
  async update(space_id, { name, capacity, type }) {
    const result = await pool.query(
      `UPDATE upel_library.spaces SET name = $1, capacity = $2, type = $3, updated_at = NOW() WHERE space_id = $4 RETURNING *`,
      [name, capacity, type, space_id]
    );
    return result.rows[0];
  },
  async delete(space_id) {
    const result = await pool.query('DELETE FROM upel_library.spaces WHERE space_id = $1 RETURNING *', [space_id]);
    return result.rows[0];
  }
};

module.exports = Space;
