const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Display Schema
 * @private
 */
const displaySchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  text: {
    type: String,
    required: true,
  },
  list: {
    type: Array,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
displaySchema.method({
  transform() {
    const transformed = {};
    const fields = ['title', 'text', 'list', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
displaySchema.statics = {
  /**
   * Get playlist
   *
   * @param {ObjectId} id - The objectId of playlist.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let display;

      if (mongoose.Types.ObjectId.isValid(id)) {
        display = await this.findById(id).exec();
      }
      if (display) {
        return display;
      }

      throw new APIError({
        message: 'Display Item does not exist',
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
    page = 1, perPage = 30, title, location,
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
        text: 1,
        list:1,
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
 * @typedef display
 */
module.exports = mongoose.model('display', displaySchema);
