const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Display = require('../models/display.model');
//const Media = require('../models/media.model');
const { handler: errorHandler } = require('../middlewares/error');
const { uploadPath } = require('../../config/vars');

/**
 * Load display and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const display = await Display.get(id);
    req.locals = { display };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get display
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const display = req.locals.display.transform();
    res.json(display);
  } catch (error) {
    next(error);
  }
};
// res.json(req.locals.display.transform());


/**
 * Create new display
 * @public
 */
exports.create = async (req, res, next) => {
  try {

    const display = new Display(req.body);
    const savedDisplay = await display.save();
    res.status(httpStatus.CREATED);
    res.json(savedDisplay);
  } catch (error) {
    next(error);
  }
};

/**
 * Get display list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
      let display = await Display.list(req.query);
      if (display.length === 0) {
        display = [
          {
            total: 0,
            results: [],
          },
        ];
      }
      display[0].page = req.query.page;
      display[0].perPage = req.query.perPage;
      const results = display[0];
  
      res.json(results);
    } catch (error) {
      next(error);
    }
};

/**
 * Replace existing display PATCH
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
      const { display } = req.locals;
      const newDisplay = new Display(req.body);
  
      await display.update(newDisplay, { override: true, upsert: true });
      const savedDisplay = await Display.findById(display._id);
  
      res.json(savedDisplay.transform());
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update existing display PUT
   * @public
   */
  exports.update = (req, res, next) => {
    const updatedDisplay = req.body;
    const display = Object.assign(req.locals.display, updatedDisplay);
  
    display.save()
      .then(savedDisplay => res.json(savedDisplay))
      .catch(e => next(e));
  };

  /**
 * Delete display 
 * @public
 */
exports.remove = (req, res, next) => {
    const { display } = req.locals;
    display.remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(e => next(e));
  };

  /**
 * Add media to existing display
 * @public
 */
exports.addmedia = (req, res, next) => {
  req.locals.display.list = req.locals.display.list.concat(req.body.list)
    .filter((elem, pos, arr) => arr.indexOf(elem) === pos);
  const { display } = req.locals;

  display.save()
    .then(savedDisplay => res.json(savedDisplay))
    .catch(e => next(e));
};

/**
 * Delete media to existing display
 * @public
 */
exports.deletemedia = (req, res, next) => {
  req.locals.display.list = req.locals.display.list
    .filter(elem => req.body.list.indexOf(elem) < 0)
    .map(elem => elem);
  const { display } = req.locals;

  display.save()
    .then(savedDisplay => res.json(savedDisplay))
    .catch(e => next(e));
};