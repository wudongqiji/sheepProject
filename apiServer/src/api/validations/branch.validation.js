const Joi = require('joi');

module.exports = {

  // GET /v1/branch
  listBranch: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
    },
  },

  // GET /v1/branch/:branchId
  getBranch: {
    params: {
      branchId: Joi.string().required()
    },
  },

  // POST /v1/branch
  createBranch: {
    body: {
      name: Joi.string(),
      district: Joi.string().required(),
      location: Joi.string().required(),
    },
  },

  // PATCH /v1/branch/:branchId
  updateBranch: {
    body: {
      name: Joi.string(),
      district: Joi.string(),
      location: Joi.string(),
    },
    params: {
      branchId: Joi.string().required(),
    },
  },

  // DELETE /v1/branch/:branchId
  removeBranch: {
    params: {
      branchId: Joi.string().required()
    },
  },

};
