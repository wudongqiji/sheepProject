const Joi = require('joi');

module.exports = {

  // GET /v1/device
  listDevice: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      branchId: Joi.string(),
      status: Joi.string(),
      activated: Joi.boolean(),
    },
  },

  // GET /v1/device/:deviceId
  getDevice: {
    params: {
      deviceId: Joi.string().required()
    },
  },

  // POST /v1/device
  registerDevice: {
    body: {
      branchId: Joi.string().required(),
      name: Joi.string().required(),
      deviceSerialNum: Joi.string().required(),
      remark: Joi.string(),
      activated: Joi.boolean(),
      activatedCode: Joi.string(),
    },
  },

  // PATCH /v1/device/:deviceId
  updateDevice: {
    body: {
      branchId: Joi.string(),
      name: Joi.string(),
      deviceSerialNum: Joi.string(),
      remark: Joi.string(),
      status: Joi.string(),
      activated: Joi.boolean(),
      activatedCode: Joi.string(),
    },
    params: {
      deviceId: Joi.string().required(),
    },
  },

  // DELETE /v1/device/:deviceId
  removeDevice: {
    params: {
      deviceId: Joi.string().required()
    },
  },

};
