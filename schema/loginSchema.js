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
  password: Joi.string().min(8).max(30).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
      'string.empty': 'La contraseña es requerida',
      'string.min': 'La contraseña debe tener al menos 8 caracteres',
      'string.max': 'La contraseña no puede exceder los 30 caracteres',
      'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)'
    })
});

module.exports = loginSchema;
