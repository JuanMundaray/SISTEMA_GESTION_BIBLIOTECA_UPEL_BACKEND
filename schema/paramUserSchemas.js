const Joi = require('joi');

const ciParamSchema = Joi.object({
  ci: Joi.string().min(7).max(9).pattern(/^[0-9]+$/).required()
    .messages({
      'string.empty': 'La cédula es requerida',
      'string.min': 'La cédula es demasiado corta',
      'string.max': 'La cédula es demasiado larga',
      'string.pattern.base': 'La cédula solo puede tener números'
    })
});

const emailParamSchema = Joi.object({
  email: Joi.string().email().required()
    .messages({
      'string.empty': 'El email es requerido',
      'string.email': 'El email no es válido'
    })
});

module.exports = {
  ciParamSchema,
  emailParamSchema
};
