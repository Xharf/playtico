const Joi = require('joi');

const ImageHeadersSchema = Joi.object({
  'content-type': Joi.string().valid('image/apng', 'image/avif', 'image/gif', 'image/jpeg', 'image/png', 'image/webp').required(),
}).unknown();

const SongHandlerSchema = Joi.object({
  'content-type': Joi.string().valid('audio/aac', 'audio/aiff', 'audio/flac', 'audio/mp3', 'audio/mpeg', 'audio/ogg', 'audio/wav', 'audio/webm', 'audio/m4a').required(),
}).unknown();

module.exports = { ImageHeadersSchema, SongHandlerSchema };
