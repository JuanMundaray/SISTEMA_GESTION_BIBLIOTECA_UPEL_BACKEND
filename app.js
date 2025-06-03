require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');

const { getUsers, createUser } = require('./queries/user');

const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
  next();
});

app.get('/', (req,res) => {
    res.send("hola mundo");
});


app.get('/users', (req,res) => {
    getUsers()
    .then((results) => {
      console.log('Datos de la tabla usuarios:');
      res.send(results.rows);
    })
    .catch((error) => {
        console.error('Error al obtener datos de la tabla usuarios', error);
    });
});

app.post('/users/create', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Faltan campos requeridos: username, email, password' });
        }
        const result = await createUser({ username, email, password });
        res.status(201).json({ message: 'Usuario creado exitosamente', user: result.rows[0] });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error interno al crear usuario' });
    }
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor escuchando en http://localhost:${PORT}`);
  console.log(`Entorno: ${process.env.NODE_ENV || 'development'}`);
});