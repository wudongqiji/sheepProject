const httpStatus = require('http-status');
// const { omit } = require('lodash');
const Company = require('../models/company.model');
//const Media = require('../models/media.model');
const { handler: errorHandler } = require('../middlewares/error');
const { uploadPath } = require('../../config/vars');

/**
 * Load company and append to req.
 * @public
 */
exports.load = async (req, res, next, id) => {
  try {
    const company = await Company.get(id);
    req.locals = { company };
    return next();
  } catch (error) {
    return errorHandler(error, req, res);
  }
};

/**
 * Get company
 * @public
 */
exports.get = async (req, res, next) => {
  try {
    const company = req.locals.company.transform();
    res.json(company);
  } catch (error) {
    next(error);
  }
};
// res.json(req.locals.company.transform());


/**
 * Create new company
 * @public
 */
exports.create = async (req, res, next) => {
  try {
   // req.body.userId = req.user.email;
    const company = new Company(req.body);
    const savedcompany = await company.save();
    res.status(httpStatus.CREATED);
    res.json(savedcompany);
  } catch (error) {
    next(error);
  }
};

/**
 * Get company list
 * @public
 */
exports.list = async (req, res, next) => {
    try {
      let company = await Company.list(req.query);
      if (company.length === 0) {
        company = [
          {
            total: 0,
            results: [],
          },
        ];
      }
      company[0].page = req.query.page;
      company[0].perPage = req.query.perPage;
      const results = company[0];
  
      res.json(results);
    } catch (error) {
      next(error);
    }
};

/**
 * Replace existing company PATCH
 * @public
 */
exports.replace = async (req, res, next) => {
    try {
      const { company } = req.locals;
      const newCompany = new Company(req.body);
  
      await company.update(newCompany, { override: true, upsert: true });
      const savedCompany = await Company.findById(company._id);
  
      res.json(savedCompany.transform());
    } catch (error) {
      next(error);
    }
  };
  
  /**
   * Update existing company PUT
   * @public
   */
  exports.update = (req, res, next) => {
    const updatedCompany = req.body;
    const company = Object.assign(req.locals.company, updatedCompany);
  
    company.save()
      .then(savedCompany => res.json(savedCompany))
      .catch(e => next(e));
  };

  /**
 * Delete Authorization
 * @public
 */
exports.remove = (req, res, next) => {
    const { company } = req.locals;
    company.remove()
      .then(() => res.status(httpStatus.NO_CONTENT).end())
      .catch(e => next(e));
  };