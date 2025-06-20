const Joi = require('joi');

const fineSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  checkout_id: Joi.number().integer().positive().required(),
  amount: Joi.number().min(0).required(),
  reason: Joi.string().max(100).required(),
  issue_date: Joi.date().iso().optional(),
  is_paid: Joi.boolean().optional(),
  payment_date: Joi.date().iso().allow(null)
});

module.exports = fineSchema;
