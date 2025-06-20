const Joi = require('joi');

const spaceSchema = Joi.object({
  name: Joi.string().min(3).max(50).required(),
  capacity: Joi.number().integer().positive().required(),
  type: Joi.string().valid('study_room', 'auditorium', 'cubicle').required()
});

module.exports = spaceSchema;
