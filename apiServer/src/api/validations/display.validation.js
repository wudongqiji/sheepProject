const Joi = require('joi');

module.exports = {

  // GET /v1/display
  listDisplay: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
    },
  },

  // POST /v1/display
  createDisplay: {
    body: {
      title: Joi.string().required(),
      text: Joi.string().required(),
      list: Joi.array().required(),
    },
  },

   // PUT /v1/display/:displayId
   replaceDisplay: {
    body: {
      title: Joi.string(),
      text: Joi.string(),
      list: Joi.array(),
    },
    params: {
      displayId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/display/:display
  updateDisplay: {
    body: {
      title: Joi.string(),
      text: Joi.string(),
      list: Joi.array(),
    },
    params: {
      displayId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // POST & DELETE /v1/display/:displayId
  mediaDisplay: {
    body: {
      list: Joi.array().required(),
    },
    params: {
      displayId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
