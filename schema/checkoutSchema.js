const Joi = require('joi');

const checkoutSchema = Joi.object({
  copy_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  checkout_date: Joi.date().iso().optional(),
  due_date: Joi.date().iso().required(),
  return_date: Joi.date().iso().allow(null),
  status: Joi.string().valid('active', 'returned', 'overdue', 'lost').optional(),
  fine_amount: Joi.number().min(0).optional()
});

module.exports = checkoutSchema;
