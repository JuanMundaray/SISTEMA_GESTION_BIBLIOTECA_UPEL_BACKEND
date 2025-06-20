// models/fineModel.js
const pool = require('../config/db');

const Fine = {
  async create({ user_id, checkout_id, amount, reason, issue_date, is_paid }) {
    const result = await pool.query(
      `INSERT INTO fines (user_id, checkout_id, amount, reason, issue_date, is_paid) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [user_id, checkout_id, amount, reason, issue_date, is_paid]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM fines');
    return result.rows;
  },
  async findById(fine_id) {
    const result = await pool.query('SELECT * FROM fines WHERE fine_id = $1', [fine_id]);
    return result.rows[0];
  },
  async update(fine_id, { amount, reason, is_paid }) {
    const result = await pool.query(
      `UPDATE fines SET amount = $1, reason = $2, is_paid = $3, updated_at = NOW() WHERE fine_id = $4 RETURNING *`,
      [amount, reason, is_paid, fine_id]
    );
    return result.rows[0];
  },
  async delete(fine_id) {
    const result = await pool.query('DELETE FROM fines WHERE fine_id = $1 RETURNING *', [fine_id]);
    return result.rows[0];
  }
};

module.exports = Fine;
