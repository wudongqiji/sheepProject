const Joi = require('joi');

module.exports = {

  // GET /v1/media
  listMedia: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
      artist: Joi.string(),
      album: Joi.string(),
      genre: Joi.string(),
      year: Joi.number(),
    },
  },

  // POST /v1/media
  createMedia: {
    body: {
      filename: Joi.string().required(),
      title: Joi.string(),
      artist: Joi.string(),
      album: Joi.string(),
      genre: Joi.string(),
      year: Joi.number(),
    },
  },

  // PUT /v1/media/:mediaId
  replaceMedia: {
    body: {
      title: Joi.string().required(),
      artist: Joi.string().allow(''),
      album: Joi.string().allow(''),
      genre: Joi.string().allow(''),
      year: Joi.number().allow(''),
    },
    params: {
      mediaId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/media/:mediaId
  updateMedia: {
    body: {
      title: Joi.string(),
      artist: Joi.string().allow(''),
      album: Joi.string().allow(''),
      genre: Joi.string().allow(''),
      year: Joi.number().allow(''),
    },
    params: {
      mediaId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },
};
