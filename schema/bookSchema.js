const Joi = require('joi');

const bookSchema = Joi.object({
  isbn: Joi.string().max(20).required(),
  title: Joi.string().max(200).required(),
  author: Joi.string().max(100).required(),
  publisher: Joi.string().max(100).allow(null, ''),
  publication_year: Joi.number().integer().min(1000).max(2100).allow(null),
  category: Joi.string().max(50).required(),
  edition: Joi.string().max(20).allow(null, ''),
  is_available: Joi.boolean().default(true),
  cover_url: Joi.string().uri().allow(null, '')
});

module.exports = bookSchema;
