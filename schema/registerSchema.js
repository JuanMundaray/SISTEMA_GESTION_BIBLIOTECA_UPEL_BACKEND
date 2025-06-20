const Joi = require('joi');

// Esquema para registro de usuario
const registerSchema = Joi.object({
  ci: Joi.string().min(7).max(9).required().pattern(/^[0-9]+$/)
    .messages({
        'string.empty': 'La cedula de identidad es requerida',
        'string.min': 'El número de cedula es demasiado corto',
        'string.max': 'El número de cedula es demasiado largo',
        'string.pattern.base': 'La cedula solo puede tener números'
    }),
  first_name: Joi.string().min(3).max(50).required().pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
    .messages({
        'string.empty': 'El nombre es requerido',
        'string.min': 'El nombre debe tener al menos 3 caracteres',
        'string.max': 'El nombre no puede exceder los 50 caracteres',
        'string.pattern.base': 'El nombre no puede contener espacios ni caracteres especiales'
    }),
  last_name: Joi.string().min(3).max(50).required().pattern(/^[a-zA-ZÀ-ÿ\u00f1\u00d1]+$/)
    .messages({
        'string.empty': 'El apellido es requerido',
        'string.min': 'El apellido debe tener al menos 3 caracteres',
        'string.max': 'El apellido no puede exceder los 50 caracteres',
        'string.pattern.base': 'El nombre no puede contener espacios ni caracteres especiales'
    }),
  username: Joi.string().min(4).max(20).required().pattern(/^[a-zA-Z0-9_.-]+$/)
    .messages({
        'string.empty': 'El nombre de Usuario es requerido',
        'string.min': 'El nombre de usuario debe tener al menos 3 caracteres',
        'string.max': 'El nombre de usuario no puede exceder los 50 caracteres',
        'string.pattern.base': 'El nombre de usuario solo permite los cáracteres especiales: . - _'
    }),
  email: Joi.string().email().required()
    .messages({
      'string.email': 'Por favor ingresa un email válido',
      'string.empty': 'El email es requerido'
    }),
  phone: Joi.string().required().pattern(/^\+58[\s\-]?(0?[24]\d{2})[\s\-]?(\d{3}[\s\-]?\d{4})$/)
    .messages({
        'string.empty': 'El número de teléfono es requerido',
        'string.pattern.base': 'EL numero de telefono debe contener el codigo de país, seguir el formato +58 412 187 8875 o +584121878875'
    }),
  password: Joi.string().min(8).max(30).required()
    .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%^&*])'))
    .messages({
        'string.empty': 'La contraseña es requerida',
        'string.min': 'La contraseña debe tener al menos 8 caracteres',
        'string.max': 'La contraseña no puede exceder los 30 caracteres',
        'string.pattern.base': 'La contraseña debe contener al menos una mayúscula, una minúscula, un número y un carácter especial (!@#$%^&*)'
    }),
  user_type: Joi.string().valid('student', 'professor', 'admin').default('student')
    .messages({
        'any.only': 'El tipo de usuario debe ser student, professor o admin'
    })
});

module.exports = registerSchema;
