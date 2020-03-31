const Joi = require('joi');

module.exports = {

  // GET /v1/Schedule
  listSchedule: {
    query: {
      page: Joi.number().min(1),
      perPage: Joi.number().min(1).max(100),
      title: Joi.string(),
    },
  },

  // POST /v1/Schedule
  createSchedule: {
    body: Joi.object({
      title: Joi.string().required(),
      text: Joi.string(),
      list: Joi.array().required(),
      dateFrom: Joi.date().min('now').required(),
      dateTo: Joi.date().min(Joi.ref('dateFrom')).required(),
      // dateFrom: Joi.number().min(Math.floor(new Date() / 1000)),
      // dateTo: Joi.number().greater(Joi.ref('dateFrom')),
      company: Joi.string().required(),
    }),
  },

   // PUT /v1/schedule/:scheduleId
   replaceSchedule: {
    body: {
      title: Joi.string().required(),
      list: Joi.array(),
      text: Joi.string(),
      dateFrom: Joi.date(),
      dateTo: Joi.date(),
      company: Joi.string().required(),
    },
    params: {
      scheduleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

  // PATCH /v1/schedule/:schedule
  updateSchedule: {
    body: {
      title: Joi.string(),
      list: Joi.array(),
      text: Joi.string(),
      dateFrom: Joi.date(),
      dateTo: Joi.date(),
      company: Joi.string(),
    },
    params: {
      scheduleId: Joi.string().regex(/^[a-fA-F0-9]{24}$/).required(),
    },
  },

};
