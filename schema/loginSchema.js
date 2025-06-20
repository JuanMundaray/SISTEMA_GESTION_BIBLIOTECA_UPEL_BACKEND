const Joi = require('joi');

// Esquema para login de usuario
const loginSchema = Joi.object({
  ci: Joi.string().min(7).max(9).required().pattern(/^[0-9]+$/)
    .messages({
        'string.empty': 'La cedula de identidad es requerida',
        'string.min': 'El número de cedula es demasiado corto',
        'string.max': 'El número de cedula es demasiado largo',
        'string.pattern.base': 'La cedula solo puede tener números'
    }),
  password: Joi.string().required()
    .messages({
      'string.empty': 'La contraseña es requerida'
    })
});

module.exports = loginSchema;
