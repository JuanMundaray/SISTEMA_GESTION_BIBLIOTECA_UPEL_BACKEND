const Joi = require('joi');

const holdSchema = Joi.object({
  book_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  hold_date: Joi.date().iso().optional(),
  expiry_date: Joi.date().iso().optional(),
  status: Joi.string().valid('pending', 'fulfilled', 'cancelled').required()
});

module.exports = holdSchema;
