const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Schedule = require('../models/schedule.model');
const { handler: errorHandler } = require('../middlewares/error');
const { uploadPath } = require('../../config/vars');

/**
 * Load Schedule and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const schedule = await Schedule.get(id);
    req.locals = { schedule };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get Schedule
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const schedule = req.locals.Schedule.transform();
    res.json(schedule);
  } catch (error) {
    next(error);
  }
};
// res.json(req.locals.Schedule.transform());


/**
 * Create new Schedule
 * @public
 */
exports.create = async (req, res, next) => {
  try {
    const schedule = new Schedule(req.body);
    const savedSchedule = await schedule.save();
    res.status(httpStatus.CREATED);
    res.json(savedSchedule);
  } catch (error) {
    next(error);
  }
};

/**
 * Get schedule list
 * @public
 */
exports.list = async (req, res, next) => {
  try {
    let schedule = await Schedule.list(req.query);
    if (schedule.length === 0) {
      schedule = [
        {
          total: 0,
          results: [],
        },
      ];
    }
    schedule[0].page = req.query.page;
    schedule[0].perPage = req.query.perPage;
    const results = schedule[0];

    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
* Replace existing schedule PATCH
* @public
*/
exports.replace = async (req, res, next) => {
  try {
    const { schedule } = req.locals;
    const newSchedule = new Schedule(req.body);

    await schedule.update(newSchedule, { override: true, upsert: true });
    const savedSchedule = await Schedule.findById(schedule._id);

    res.json(savedSchedule.transform());
  } catch (error) {
    next(error);
  }
};

/**
 * Update existing schedule PUT
 * @public
 */
exports.update = (req, res, next) => {
  const updatedSchedule = req.body;
  const schedule = Object.assign(req.locals.schedule, updatedSchedule);

  schedule.save()
    .then(savedSchedule => res.json(savedSchedule))
    .catch(e => next(e));
};

/**
* Delete schedule
* @public
*/
exports.remove = (req, res, next) => {
  const { schedule } = req.locals;
  schedule.remove()
    .then(() => res.status(httpStatus.NO_CONTENT).end())
    .catch(e => next(e));
};