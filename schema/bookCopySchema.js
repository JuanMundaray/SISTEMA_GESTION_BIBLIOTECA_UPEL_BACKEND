const Joi = require('joi');

const bookCopySchema = Joi.object({
  book_id: Joi.number().integer().positive().required(),
  barcode: Joi.string().max(50).required(),
  location: Joi.string().max(50).required(),
  status: Joi.string().valid('available', 'checked_out', 'under_maintenance').required()
});

module.exports = bookCopySchema;
