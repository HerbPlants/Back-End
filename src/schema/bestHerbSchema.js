const Joi = require('joi');

const BestHerbPayloadSchema = Joi.object({
  herbId: Joi.number().integer().required(),
});

const BestHerbParamsSchema = Joi.object({
  id: Joi.number().integer().required(),
});

module.exports = {
  BestHerbPayloadSchema,
  BestHerbParamsSchema,
};