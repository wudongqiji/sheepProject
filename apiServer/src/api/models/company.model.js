const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Company Schema
 * @private
 */
const companySchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  info: {
    type: String,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
companySchema.method({
  transform() {
    const transformed = {};
    const fields = ['title', 'info', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
companySchema.statics = {
  /**
   * Get playlist
   *
   * @param {ObjectId} id - The objectId of playlist.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let company;

      if (mongoose.Types.ObjectId.isValid(id)) {
        company = await this.findById(id).exec();
      }
      if (company) {
        return company;
      }

      throw new APIError({
        message: 'Company does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List playlist in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of playlist to be skipped.
   * @param {number} limit - Limit number of playlist to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, title, info,
  }) {
    const paramsOmit = omitBy({ title}, isNil);

    const options = [];
    Object.keys(paramsOmit).forEach((key) => {
      const opt = {
        $match: {},
      };
      opt.$match[key] = {};
      opt.$match[key] = {
        $regex: paramsOmit[key].toString(),
        $options: 'i',
      };
      options.push(opt);
    });

    options.push({
      $project: {
        _id: 1,
        title: 1,
        info: 1,
        createdAt: 1,
      },
    });

    options.push({
        $group: {
          _id: null,
          total: { $sum: 1 },
          results: { $push: '$$ROOT' },
        },
      });

    options.push({
      $project: {
        total: 1,
        results: {
          $slice: ['$results', perPage * (page - 1), perPage],
        },
      },
    });

    return this.aggregate(options)
      .exec();
  },
};

/**
 * @typedef company
 */
module.exports = mongoose.model('company', companySchema);
