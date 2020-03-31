const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');

/**
 * Media Schema
 * @private
 */
const scheduleSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  company: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  text: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  dateFrom: {
    type: Date,
    required: true,
  },
  dateTo: {
    type: Date,
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
scheduleSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'company', 'dateFrom','dateTo', 'list'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
scheduleSchema.statics = {
  /**
   * Get schedule
   *
   * @param {ObjectId} id - The objectId of schedule.
   * @returns {Promise<User, APIError>}
   */
  async get(id) {
    try {
      let schedule;

      if (mongoose.Types.ObjectId.isValid(id)) {
        schedule = await this.findById(id).exec();
      }
      if (schedule) {
        return schedule;
      }

      throw new APIError({
        message: 'Schedule does not exist',
        status: httpStatus.NOT_FOUND,
      });
    } catch (error) {
      throw error;
    }
  },

  /**
   * List schedule in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of schedule to be skipped.
   * @param {number} limit - Limit number of schedule to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 30, title,
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
        dateFrom: 1,
        dateTo: 1,
        company: 1,
        text:1,
        list: 1,
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
 * @typedef schedule
 */
module.exports = mongoose.model('schedule', scheduleSchema);
