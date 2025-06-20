// models/holdModel.js
const pool = require('../config/db');

const Hold = {
  async create({ book_id, user_id, expiry_date, status }) {
    const result = await pool.query(
      `INSERT INTO upel_library.holds (book_id, user_id, expiry_date, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [book_id, user_id, expiry_date, status]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.holds');
    return result.rows;
  },
  async findById(hold_id) {
    const result = await pool.query('SELECT * FROM upel_library.holds WHERE hold_id = $1', [hold_id]);
    return result.rows[0];
  },
  async update(hold_id, { expiry_date, status }) {
    const result = await pool.query(
      `UPDATE upel_library.holds SET expiry_date = $1, status = $2, updated_at = NOW() WHERE hold_id = $3 RETURNING *`,
      [expiry_date, status, hold_id]
    );
    return result.rows[0];
  },
  async delete(hold_id) {
    const result = await pool.query('DELETE FROM upel_library.holds WHERE hold_id = $1 RETURNING *', [hold_id]);
    return result.rows[0];
  }
};

module.exports = Hold;
