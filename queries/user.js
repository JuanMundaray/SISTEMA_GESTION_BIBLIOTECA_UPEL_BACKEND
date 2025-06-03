const pool = require('../config/db');
const getUsers = () => {
    return pool.query('SELECT * FROM upel_library.user');
}

// Crea un usuario en la base de datos de forma segura
const createUser = async ({ username, email, password }) => {
    // Ajusta los campos según la estructura real de tu tabla
    const query = `INSERT INTO upel_library.user (username, email, password) VALUES ($1, $2, $3) RETURNING *`;
    const values = [username, email, password];
    return pool.query(query, values);
};

module.exports = {
    getUsers,
    createUser
}