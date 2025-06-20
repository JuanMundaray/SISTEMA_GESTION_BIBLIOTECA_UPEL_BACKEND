// models/academicProgramModel.js
const pool = require('../config/db');

const AcademicProgram = {
  async create({ name, faculty }) {
    const result = await pool.query(
      `INSERT INTO academic_programs (name, faculty) VALUES ($1, $2) RETURNING *`,
      [name, faculty]
    );
    return result.rows[0];
  },
  async findAll() {
    const result = await pool.query('SELECT * FROM academic_programs');
    return result.rows;
  },
  async findById(program_id) {
    const result = await pool.query('SELECT * FROM academic_programs WHERE program_id = $1', [program_id]);
    return result.rows[0];
  },
  async update(program_id, { name, faculty }) {
    const result = await pool.query(
      `UPDATE academic_programs SET name = $1, faculty = $2, updated_at = NOW() WHERE program_id = $3 RETURNING *`,
      [name, faculty, program_id]
    );
    return result.rows[0];
  },
  async delete(program_id) {
    const result = await pool.query('DELETE FROM academic_programs WHERE program_id = $1 RETURNING *', [program_id]);
    return result.rows[0];
  }
};

module.exports = AcademicProgram;
