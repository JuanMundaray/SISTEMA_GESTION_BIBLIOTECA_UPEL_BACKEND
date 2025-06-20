const Joi = require('joi');

const digitalResourceSchema = Joi.object({
  book_id: Joi.number().integer().positive().allow(null),
  title: Joi.string().max(200).required(),
  author: Joi.string().max(100).allow(null, ''),
  url: Joi.string().uri().required(),
  type: Joi.string().valid('ebook', 'article', 'thesis').required(),
  upload_date: Joi.date().iso().optional()
});

module.exports = digitalResourceSchema;
