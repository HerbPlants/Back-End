const Joi = require('joi');

const UserPayloadSchema = Joi.object({
  username: Joi.string()
    .required()
    .messages({
      'string.base': 'Username harus berupa teks',
      'any.required': 'Username wajib diisi'
    }),

  password: Joi.string()
    .required()
    .messages({
      'string.base': 'Password harus berupa teks',
      'any.required': 'Password wajib diisi'
    }),

  fullname: Joi.string()
    .required()
    .messages({
      'string.base': 'Fullname harus berupa teks',
      'any.required': 'Fullname wajib diisi'
    }),

  email: Joi.string()
    .email()
    .required()
    .messages({
      'string.base': 'Email harus berupa teks',
      'string.email': 'Email tidak valid',
      'any.required': 'Email wajib diisi'
    }),
}).messages({ 'object.base': 'Data Harus Berbentuk JSON'}).prefs({ abortEarly: false }); 

module.exports = { UserPayloadSchema };
