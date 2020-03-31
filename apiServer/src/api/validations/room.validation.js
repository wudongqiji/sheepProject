const Joi = require('joi');

module.exports = {

  // GET /v1/room
  listRoom: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
    },
  },

  // POST /v1/room
  createRoom: {
    body: {
      title: Joi.string().required(),
      location: Joi.string().required()
    },
  },

   // PUT /v1/room/:roomId
   replaceRoom: {
    body: {
      title: Joi.string().required(),
      list: Joi.array(),
    },
    params: {
      roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/room/:room
  updateRoom: {
    body: {
      title: Joi.string(),
      list: Joi.array(),
    },
    params: {
      roomId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
