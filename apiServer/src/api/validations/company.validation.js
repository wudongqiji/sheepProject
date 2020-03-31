const Joi = require('joi');

module.exports = {

  // GET /v1/company
  listCompany: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
      info: Joi.string()
    },
  },

  // POST /v1/company
  createCompany: {
    body: {
      title: Joi.string().required(),
      info: Joi.string()
    },
  },

   // PUT /v1/company/:companyId
   replaceCompany: {
    body: {
      title: Joi.string().required(),
      info: Joi.string(),
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/company/:company
  updateCompany: {
    body: {
      title: Joi.string(),
      info: Joi.string(),
    },
    params: {
      companyId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
