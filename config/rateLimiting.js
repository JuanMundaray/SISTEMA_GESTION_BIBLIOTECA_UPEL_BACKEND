const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // Límite por IP
  message: 'Has excedido el límite de 100 peticiones en 15 minutos',
  headers: true // Envía headers X-RateLimit-*
});

module.exports = {
    limiter
};