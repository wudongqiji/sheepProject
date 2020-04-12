const httpStatus = require('http-status');
const Branch = require('../models/branch.model');
const Device = require('../models/device.model');
const { handler: errorHandler } = require('../middlewares/error');

/**
 * Load branch and append to req
 */
exports.load = async (req, res, next, id) => {
  try {
    const branch = await Branch.get(id);
    req.locals = { branch };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get branch
 */
exports.get = async (req, res, next) => {
  try {
    let branch = (req.locals.branch).toObject();
    let device = await Device.list(branchId = branch._id);
    branch.devices = device[0].results;
    res.json(branch);
  } catch (error) {
    next(error);
  }
}

/**
 * Create branch
 */
exports.create = async (req, res, next) => {
  try {
    const branch = new Branch(req.body);
    const savedbranch = await branch.save();
    res.status(httpStatus.CREATED);
    res.json({savedbranch});
  } catch (error) {
    next(error);
  }
}

/**
 * Get branch list
 */
exports.list = async (req, res, next) => {
  try {
    let branch = await Branch.list(req.query);
    if (branch.length === 0) {
      branch = [
        {
          total: 0,
          results: [],
        },
      ];
    }
    branch[0].page = req.query.page;
    branch[0].perPage = req.query.perPage;
    const results = branch[0];
    delete results._id;

    res.json(results);
  } catch (error) {
    next(error);
  }
}

/**
 * Update branch
 */
exports.update = async (req, res, next) => {
  const updatedBranch = req.body;
  const branch = Object.assign(req.locals.branch, updatedBranch);

  branch.save()
    .then(savedBranch => res.json(savedBranch))
    .catch(e => next(e));
}

/**
 * Delete branch
 */
exports.remove = (req, res, next) => {
  const {branch} = req.locals;
  branch.remove()
  .then(() => res.status(httpStatus.OK).end())
  .catch(e => next(e));
};