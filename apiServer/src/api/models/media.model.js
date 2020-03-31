const mongoose = require('mongoose');
const httpStatus = require('http-status');
const { omitBy, isNil } = require('lodash');
const APIError = require('../utils/APIError');
/*
const bcrypt = require('bcryptjs');
const moment = require('moment-timezone');
const jwt = require('jwt-simple');
const uuidv4 = require('uuid/v4');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');
*/
/**
 * Media Schema
 * @private
 */
const mediaSchema = new mongoose.Schema({
  title: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  filename: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    required: true,
  },
  artist: {
    type: String,
  },
  album: {
    type: String,
  },
  genre: {
    type: String,
  },
  year: {
    type: Number,
  },
  thumbnail: {
    type: String,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
mediaSchema.method({
  transform() {
    const transformed = {};
    const fields = ['id', 'title', 'filename', 'thumbnail', 'album', 'genre', 'artist', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
mediaSchema.statics = {
  /**
   * Get media
   *
   * @param {ObjectId} id - The objectId of media.
   * @returns {Promise<User, APIError>}
   */
  async get(id, receiveError = false) {
    try {
      let media;

      if (mongoose.Types.ObjectId.isValid(id)) {
        media = await this.findById(id).exec();
      }
      if (media) {
        return media;
      }

      if (!receiveError) {
        throw new APIError({
          message: 'Media does not exist',
          status: httpStatus.NOT_FOUND,
        });
      } else {
        return false;
      }
    } catch (error) {
      throw error;
    }
  },

  /**
   * List media in descending order of 'createdAt' timestamp.
   *
   * @param {number} skip - Number of media to be skipped.
   * @param {number} limit - Limit number of media to be returned.
   * @returns {Promise<User[]>}
   */
  list({
    page = 1, perPage = 10, title, artist, album, genre, year,
  }) {
    const paramsOmit = omitBy({
      title, artist, album, genre, year,
    }, isNil);

    const options = [];
    Object.keys(paramsOmit).forEach((key) => {
      const opt = {
        $match: {},
      };
      opt.$match[key] = {};
      if (key !== 'year') {
        opt.$match[key] = {
          $regex: paramsOmit[key].toString(),
          $options: 'i',
        };
      } else {
        opt.$match[key] = paramsOmit[key];
      }
      options.push(opt);
    });

    options.push({
      $sort: { createdAt: -1 },
    });

    options.push({
      $project: {
        _id: 1,
        title: 1,
        artist: 1,
        album: 1,
        genre: 1,
        year: 1,
        thumbnail: 1,
        filename: 1,
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
 * @typedef Media
 */
module.exports = mongoose.model('Media', mediaSchema);
