const Joi = require('joi');

const PostLikePayloadSchema = Joi.object({
  herbId: Joi.number().integer().required().messages({
    'number.base': 'Herb ID harus berupa angka',
    'any.required': 'Herb ID wajib diisi',
  }),
  imageUrl: Joi.string().required().messages({
    'string.base': 'Image URL harus berupa teks',
    'any.required': 'Image URL wajib diisi',
  })
}).messages({ 'object.base': 'Data Harus Berbentuk JSON' }).prefs({ abortEarly: false });

const DeleteLikePayloadSchema = Joi.object({
  herbId: Joi.number().integer().required().messages({
    'number.base': 'Herb ID harus berupa angka',
    'any.required': 'Herb ID wajib diisi',
  }),
}).messages({ 'object.base': 'Data Harus Berbentuk JSON' }).prefs({ abortEarly: false });

module.exports = {
  PostLikePayloadSchema,
  DeleteLikePayloadSchema,
};
