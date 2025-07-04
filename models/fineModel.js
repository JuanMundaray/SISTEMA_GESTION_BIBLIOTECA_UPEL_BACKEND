// models/fineModel.js
const pool = require('../config/db');

const Fine = {
  async create({ user_id, checkout_id, amount, reason, issue_date, is_paid, payment_date }) {
    const result = await pool.query(
      `INSERT INTO upel_library.fines (user_id, checkout_id, amount, reason, issue_date, is_paid, payment_date) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [user_id, checkout_id, amount, reason, issue_date, is_paid, payment_date]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.fines');
    return result.rows;
  },
  async findById(fine_id) {
    const result = await pool.query('SELECT * FROM upel_library.fines WHERE fine_id = $1', [fine_id]);
    return result.rows[0];
  },
  async findFullById(fine_id) {
    const result = await pool.query('SELECT * FROM upel_library.vw_fines_full WHERE fine_id = $1', [fine_id]);
    return result.rows[0];
  },
  async update(fine_id, { amount, reason, is_paid, payment_date }) {
    const result = await pool.query(
      `UPDATE upel_library.fines SET amount = $1, reason = $2, is_paid = $3, payment_date = $4, updated_at = NOW() WHERE fine_id = $5 RETURNING *`,
      [amount, reason, is_paid, payment_date, fine_id]
    );
    return result.rows[0];
  },
  async delete(fine_id) {
    const result = await pool.query('DELETE FROM upel_library.fines WHERE fine_id = $1 RETURNING *', [fine_id]);
    return result.rows[0];
  }
};

module.exports = Fine;
