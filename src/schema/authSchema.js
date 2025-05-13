const Joi = require('joi');

const PostAuthenticationPayloadSchema = Joi.object({
  username: Joi.string().required().messages({
    'string.empty': 'Username tidak boleh kosong',
    'any.required': 'Username wajib diisi',
  }),
  password: Joi.string().required().messages({
    'string.empty': 'Password tidak boleh kosong',
    'any.required': 'Password wajib diisi',
  }),
}).messages({ 'object.base': 'Data Harus Berbentuk JSON'}).prefs({ abortEarly: false });

const PutAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token tidak boleh kosong',
    'any.required': 'Refresh token wajib diisi',
  }),
}).messages({ 'object.base': 'Data Harus Berbentuk JSON'}).prefs({ abortEarly: false });

const DeleteAuthenticationPayloadSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'string.empty': 'Refresh token tidak boleh kosong',
    'any.required': 'Refresh token wajib diisi',
  }),
}).messages({ 'object.base': 'Data Harus Berbentuk JSON'}).prefs({ abortEarly: false });

module.exports = {
  PostAuthenticationPayloadSchema,
  PutAuthenticationPayloadSchema,
  DeleteAuthenticationPayloadSchema,
};
