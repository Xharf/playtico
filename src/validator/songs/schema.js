const Joi = require('joi');

const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  performer: Joi.string().required(),
  genre: Joi.string(),
  cover: Joi.string(),
  song: Joi.string().required(),
  duration: Joi.number(),
});

module.exports = { SongPayloadSchema };
