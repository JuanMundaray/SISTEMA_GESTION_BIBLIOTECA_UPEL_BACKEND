require('dotenv').config();
const express = require("express");
const bodyParser = require('body-parser');
const cors = require('cors');
const corsOptions = require('./config/corsOptions');
const authMiddleware = require('./middlewares/authenticateToken');
const  { limiter } = require('./config/rateLimiting');
const routesBooks = require('./routes/bookRoutes');
const routesUsers = require('./routes/userRoutes');
const routesSpaces = require('./routes/spaceRoutes');
const routesSpaceReservations = require('./routes/spaceReservationRoutes');
const routesFines = require('./routes/fineRoutes');
const routesDigitalResources = require('./routes/digitalResourceRoutes');
const swaggerUi = require('swagger-ui-express');
const swaggerJSDoc = require('swagger-jsdoc');

const app = express();

// Middlewares
app.use('/api/', limiter);
app.use(cors(corsOptions));
app.use(bodyParser.json({limit:'100kb'}));

app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Algo salió mal!');
  next();
});

app.use(authMiddleware);

app.get('/', (res,req)=>{
  req.send("API DE BIBLIOTECA PARA LA UPEL");
});

app.use('/api/book',routesBooks);
app.use('/api/users',routesUsers);
app.use('/api/spaces', routesSpaces);
app.use('/api/space-reservations', routesSpaceReservations);
app.use('/api/fines', routesFines);
app.use('/api/digital-resources', routesDigitalResources);

// Swagger configuration
const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'API Biblioteca UPEL',
    version: '1.0.0',
    description: 'Documentación de la API de gestión de usuarios y libros de la biblioteca UPEL',
  },
  servers: [
    { url: 'http://localhost:5000/api' }
  ],
};

const options = {
  swaggerDefinition,
  apis: ['./swagger/user.yaml'], // Ahora la documentación de usuarios está en swagger/user.yaml
};

const swaggerSpec = swaggerJSDoc(options);

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

module.exports = app;