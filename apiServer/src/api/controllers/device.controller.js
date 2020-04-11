const httpStatus = require('http-status');
const Device = require('../models/device.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load device and append to req
 */
exports.load = async (req, res, next, id) => {
  try {
    const device = await Device.get(id);
    req.locals = { device };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get device
 */
exports.get = async (req, res, next) => {
  try {
    const device = req.locals.device.transform();
    res.json(device);
  } catch (error) {
    next(error);
  }
};

/**
 * Register new device
 */
exports.register = async (req, res, next) => {
  try {
    const device = new Device(req.body);
    const saveddevice = await device.save();
    res.status(httpStatus.CREATED);
    res.json({
      id: saveddevice._id
    });
  } catch (error) {
    next(error);
  }
};

/**
 * Get device list
 */
exports.list = async (req, res, next) => {
  try {
    let device = await Device.list(req.query);
    if (device.length === 0) {
      device = [
        {
          total: 0,
          results: [],
        },
      ];
    }
    device[0].page = req.query.page;
    device[0].perPage = req.query.perPage;
    const results = device[0];

    res.json(results);
  } catch (error) {
    next(error);
  }
};

/**
 * Delete device
 */
exports.remove = (req, res, next) => {
  const {device} = req.locals;
  device.remove()
  .then(() => res.status(httpStatus.OK).end())
  .catch(e => next(e));
};
