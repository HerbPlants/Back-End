const Joi = require('joi');

const HerbPayloadSchema = Joi.object({
  name: Joi.string().required(),
  nameLatin: Joi.string().required(),
  nameLocal: Joi.string().required(),
  khasiat: Joi.string().required(),
  penyebaranTanaman: Joi.string().required(),
  agroekologi: Joi.string().required(),
});

module.exports = {
  HerbPayloadSchema,
  BestHerbPayloadSchema,
};
