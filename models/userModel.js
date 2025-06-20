const pool = require('../config/db');

const UserModel = {
  // Crear usuario
  async create({ci, first_name, last_name, username, email, phone, user_type, password }) {
    const result = await pool.query(
      `INSERT INTO upel_library.users (
        ci, first_name, last_name, username, email, phone, user_type, password, is_active
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) 
      RETURNING id, ci, first_name, last_name, username, email, phone, user_type, is_active`,
      [ci, first_name, last_name, username, email, phone, user_type, password, true]
    );
    return result.rows[0];
  },

  // Buscar por email (para login)
  async findByEmail(email) {
    const result = await pool.query(
      'SELECT * FROM upel_library.users WHERE email = $1 AND deleted_at IS NULL',
      [email]
    );
    return result.rows[0];
  },
  // Buscar por email (para login)
  async findByCI(ci) {
    const result = await pool.query(
      'SELECT * FROM upel_library.users WHERE ci = $1 AND deleted_at IS NULL',
      [ci]
    );
    return result.rows[0];
  },

  // Obtener todos los usuarios (paginados)
  async getAll(limit, offset) {
    const usersQuery = pool.query(
      `SELECT id, ci, first_name, last_name, username, email, phone, user_type, is_active 
       FROM upel_library.users 
       WHERE deleted_at IS NULL 
       ORDER BY created_at DESC 
       LIMIT $1 OFFSET $2`,
      [limit, offset]
    );

    const countQuery = pool.query(
      'SELECT COUNT(*) FROM upel_library.users WHERE deleted_at IS NULL'
    );

    const [usersResult, countResult] = await Promise.all([usersQuery, countQuery]);
    
    return {
      users: usersResult.rows,
      total: parseInt(countResult.rows[0].count)
    };
  },

  // Actualizar usuario
  async update(ci, { first_name, last_name, username, phone, user_type, is_active }) {
    const result = await pool.query(
      `UPDATE upel_library.users 
       SET first_name = $1, last_name = $2, username = $3, phone = $4, user_type = $5, is_active = $6 
       WHERE ci = $7 AND deleted_at IS NULL 
       RETURNING ci, first_name, last_name, username, email, phone, user_type, is_active`,
      [first_name, last_name, username, phone, user_type, is_active, ci]
    );
    return result.rows[0];
  },

  // Soft delete
  async softDelete(ci) {
    const result = await pool.query(
      `UPDATE upel_library.users 
       SET deleted_at = NOW(), is_active = false 
       WHERE ci = $1 
       RETURNING ci, username, email`,
      [ci]
    );
    return result.rows[0];
  },

  // Restaurar usuario
  async restore(ci) {
    const result = await pool.query(
      `UPDATE upel_library.users 
       SET deleted_at = NULL, is_active = true 
       WHERE ci = $1 
       RETURNING ci, username, email`,
      [ci]
    );
    return result.rows[0];
  }
};

module.exports = UserModel;