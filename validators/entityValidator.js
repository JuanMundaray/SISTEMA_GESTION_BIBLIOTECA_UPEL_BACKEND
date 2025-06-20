const Joi = require('joi');

// Book
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

// Book Copy
const bookCopySchema = Joi.object({
  book_id: Joi.number().integer().positive().required(),
  barcode: Joi.string().max(50).required(),
  location: Joi.string().max(50).required(),
  status: Joi.string().valid('available', 'checked_out', 'under_maintenance').required()
});

// Checkout
const checkoutSchema = Joi.object({
  copy_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  checkout_date: Joi.date().iso().optional(),
  due_date: Joi.date().iso().required(),
  return_date: Joi.date().iso().allow(null),
  status: Joi.string().valid('active', 'returned', 'overdue', 'lost').optional(),
  fine_amount: Joi.number().min(0).optional()
});

// Hold
const holdSchema = Joi.object({
  book_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  hold_date: Joi.date().iso().optional(),
  expiry_date: Joi.date().iso().optional(),
  status: Joi.string().valid('pending', 'fulfilled', 'cancelled').required()
});

// Space
const spaceSchema = Joi.object({
  name: Joi.string().max(50).required(),
  capacity: Joi.number().integer().positive().required(),
  type: Joi.string().valid('study_room', 'auditorium', 'cubicle').required()
});

// Space Reservation
const spaceReservationSchema = Joi.object({
  space_id: Joi.number().integer().positive().required(),
  user_id: Joi.number().integer().positive().required(),
  start_time: Joi.date().iso().required(),
  end_time: Joi.date().iso().required(),
  purpose: Joi.string().max(200).allow(null, '')
});

// Fine
const fineSchema = Joi.object({
  user_id: Joi.number().integer().positive().required(),
  checkout_id: Joi.number().integer().positive().required(),
  amount: Joi.number().min(0).required(),
  reason: Joi.string().max(100).required(),
  issue_date: Joi.date().iso().optional(),
  is_paid: Joi.boolean().optional(),
  payment_date: Joi.date().iso().allow(null)
});

// Digital Resource
const digitalResourceSchema = Joi.object({
  book_id: Joi.number().integer().positive().allow(null),
  title: Joi.string().max(200).required(),
  author: Joi.string().max(100).allow(null, ''),
  url: Joi.string().uri().required(),
  type: Joi.string().valid('ebook', 'article', 'thesis').required(),
  upload_date: Joi.date().iso().optional()
});

// Middleware de validación genérico
const validate = (schema) => (req, res, next) => {
  const { error } = schema.validate(req.body, { abortEarly: false });
  if (error) {
    const errors = error.details.map(detail => ({
      field: detail.path[0],
      message: detail.message
    }));
    return res.status(400).json({ errors });
  }
  next();
};

module.exports = {
  bookSchema,
  bookCopySchema,
  checkoutSchema,
  holdSchema,
  spaceSchema,
  spaceReservationSchema,
  fineSchema,
  digitalResourceSchema
};
