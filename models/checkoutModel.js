// models/checkoutModel.js
const pool = require('../config/db');

const Checkout = {
  async create({ copy_id, user_id, due_date }) {
    const result = await pool.query(
      `INSERT INTO upel_library.checkouts (copy_id, user_id, due_date, status) VALUES ($1, $2, $3, $4) RETURNING *`,
      [copy_id, user_id, due_date, 'active']
    );
    return result.rows[0];
  },

  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.checkouts');
    return result.rows;
  },

  async findAllJoinCopyJoinUser() {
    const result = await pool.query('SELECT * FROM upel_library.vw_checkouts_full');
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
  },

  async findActiveByCopyId(copy_id) {
    // Busca un préstamo activo para una copia (sin return_date o status 'activo')
    const result = await pool.query(
      `SELECT * FROM upel_library.checkouts WHERE copy_id = $1 AND (return_date IS NULL OR status = 'activo') LIMIT 1`,
      [copy_id]
    );
    return result.rows[0];
  },

  async findByUserId(user_id) {
    const result = await pool.query('SELECT * FROM upel_library.checkouts WHERE user_id = $1', [user_id]);
    return result.rows;
  },

  async findByCopyId(copy_id) {
    const result = await pool.query('SELECT * FROM upel_library.checkouts WHERE copy_id = $1', [copy_id]);
    return result.rows;
  },

  async findFullById(checkout_id) {
    const result = await pool.query('SELECT * FROM upel_library.vw_checkouts_full WHERE checkout_id = $1', [checkout_id]);
    return result.rows[0];
  },

  async processReturn(checkout_id, return_date = new Date()) {
    // Marca el préstamo como devuelto, actualiza return_date y status
    const result = await pool.query(
      `UPDATE upel_library.checkouts SET return_date = $1, status = 'returned', updated_at = NOW() WHERE checkout_id = $2 RETURNING *`,
      [return_date, checkout_id]
    );
    return result.rows[0];
  }
};

module.exports = Checkout;
