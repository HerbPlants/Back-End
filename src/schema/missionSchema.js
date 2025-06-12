const Joi = require("joi");

const CreateMissionPayloadSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null),
  type: Joi.string().valid("daily", "exclusive").required(),
  total: Joi.number().integer().min(1).required(),
  pointReward: Joi.number().integer().min(0).required(),
});

module.exports = {
  CreateMissionPayloadSchema,
};
