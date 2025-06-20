// models/checkoutModel.js
const pool = require('../config/db');

const Checkout = {
  async create({ copy_id, user_id, due_date }) {
    const result = await pool.query(
      `INSERT INTO upel_library.checkouts (copy_id, user_id, due_date) VALUES ($1, $2, $3) RETURNING *`,
      [copy_id, user_id, due_date]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.checkouts');
    return result.rows;
  },
  async findById(checkout_id) {
    const result = await pool.query('SELECT * FROM upel_library.checkouts WHERE checkout_id = $1', [checkout_id]);
    return result.rows[0];
  },
  async update(checkout_id, { return_date, status, fine_amount }) {
    const result = await pool.query(
      `UPDATE upel_library.checkouts SET return_date = $1, status = $2, fine_amount = $3, updated_at = NOW() WHERE checkout_id = $4 RETURNING *`,
      [return_date, status, fine_amount, checkout_id]
    );
    return result.rows[0];
  },
  async delete(checkout_id) {
    const result = await pool.query('DELETE FROM upel_library.checkouts WHERE checkout_id = $1 RETURNING *', [checkout_id]);
    return result.rows[0];
  }
};

module.exports = Checkout;
