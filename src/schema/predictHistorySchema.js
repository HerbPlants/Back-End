const Joi = require("joi");

const PostPredictHistoryPayloadSchema = Joi.object({
  name: Joi.string().required().messages({
    "any.required": "Nama tanaman harus diisi",
    "string.empty": "Nama tanaman tidak boleh kosong",
  }),
  confidence: Joi.number().min(0).max(1).required().messages({
    "any.required": "Confidence harus diisi",
    "number.base": "Confidence harus berupa angka",
    "number.min": "Confidence minimal 0",
    "number.max": "Confidence maksimal 1",
  }),
}).unknown(true);;

module.exports = { PostPredictHistoryPayloadSchema };
