require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  user:process.env.DB_USER,
  host:process.env.DB_HOST,
  database:process.env.DB_NAME_1,
  password:process.env.DB_PASSWORD,
  port:5432,
});

module.exports = pool;
