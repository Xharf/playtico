const Joi = require('joi');

const PlaylistPayloadSchema = Joi.object({
  name: Joi.string().required(),
  cover: Joi.string(),
});

module.exports = { PlaylistPayloadSchema };
