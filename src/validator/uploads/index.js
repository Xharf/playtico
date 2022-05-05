const InvariantError = require('../../exceptions/InvariantError');
const { ImageHeadersSchema, SongHandlerSchema } = require('./schema');

const UploadsValidator = {
  validateImageHeaders: (headers) => {
    const validationResult = ImageHeadersSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },

  validateSongHeaders: (headers) => {
    const validationResult = SongHandlerSchema.validate(headers);

    if (validationResult.error) {
      throw new InvariantError(validationResult.error.message);
    }
  },
};

module.exports = UploadsValidator;
