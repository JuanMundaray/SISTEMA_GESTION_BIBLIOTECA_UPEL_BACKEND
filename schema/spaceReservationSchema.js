const Joi = require('joi');

const spaceReservationSchema = Joi.object({
  space_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().required(),
  purpose: Joi.string().max(200).allow(null, '')
});

const spaceReservationUpdateSchema = Joi.object({
  start_time: Joi.date().iso().optional(),
  end_time: Joi.date().iso().optional(),
  purpose: Joi.string().max(200).allow(null, '')
});

module.exports = 
{
  spaceReservationSchema,
  spaceReservationUpdateSchema
};
