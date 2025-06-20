// models/spaceReservationModel.js
const pool = require('../config/db');

const SpaceReservation = {
  async create({ space_id, user_id, start_time, end_time, purpose }) {
    const result = await pool.query(
      `INSERT INTO upel_library.space_reservations (space_id, user_id, start_time, end_time, purpose) VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [space_id, user_id, start_time, end_time, purpose]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM upel_library.space_reservations');
    return result.rows;
  },
  async findById(reservation_id) {
    const result = await pool.query('SELECT * FROM upel_library.space_reservations WHERE reservation_id = $1', [reservation_id]);
    return result.rows[0];
  },
  async update(reservation_id, { start_time, end_time, purpose }) {
    const result = await pool.query(
      `UPDATE upel_library.space_reservations SET start_time = $1, end_time = $2, purpose = $3, updated_at = NOW() WHERE reservation_id = $4 RETURNING *`,
      [start_time, end_time, purpose, reservation_id]
    );
    return result.rows[0];
  },
  async delete(reservation_id) {
    const result = await pool.query('DELETE FROM upel_library.space_reservations WHERE reservation_id = $1 RETURNING *', [reservation_id]);
    return result.rows[0];
  }
};

module.exports = SpaceReservation;
