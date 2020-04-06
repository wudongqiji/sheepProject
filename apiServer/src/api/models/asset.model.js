const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const _contentType = ['image', 'video'];
const _advertisemenType = ['month', 'spare'];
const _screenPosition = ['A', 'B', 'C', 'E'];

/**
 * Asset Schema
 * @private
 */
const assetSchema = new mongoose.Schema({
  advertisementId: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  contentType: {
    type: String,
    enum: _contentType,
  },
  advertisemenType: {
    type: String,
    enum: _advertisemenType,
  },
  imageUrl: {
    type: String,
    trim: true,
  },
  videoUrl: {
    type: String,
    trim: true,
  },
  duration: {
    type: Number,
  },
  screenPosition: {
    type: String,
    enum: _screenPosition,
  },
}, {
  timestamps: true,
});

/**
 * Statics
 */
assetSchema.statics = {
  async get(id, receiveError = false){
    try{
      let asset;
      if(mongoose.Types.ObjectId.isValid(id)){
        asset = await this.findById(id, {__v: 0}).exec();
      }
      if(asset)
        return asset;
      if(!receiveError){
        throw new APIError({
          message: 'Asset does not exist',
          status: httpStatus.NOT_FOUND
        });
      }else{
        return false;
      }
    }catch(error){
      throw error;
    }

  },
  list({page = null, perPage = null, advertisemenType = null, contentType = null, screenPosition = null}, query) {
    const options = [];
    if(query){
      options.push({
        $match: query
      });
    }

    options.push({
      $sort: {
        createdAt: -1,
      }
    });

    options.push({
      $project: {
        _id: 1,
        advertisementId: 1,
        name: 1,
        contentType: 1,
        advertisemenType: 1,
        imageUrl: 1,
        videoUrl: 1,
        duration: 1,
        screenPosition: 1,
        createdAt: 1,
        updatedAt: 1,
      },
    });

    options.push({
      $group: {
        _id: null,
        total: { $sum: 1 },
        results: { $push: '$$ROOT' },
      },
    });

    if (advertisemenType) {
      options.push({
        $match: {
            'advertisemenType': advertisemenType
        }
      });
    }

    if (contentType) {
      options.push({
        $match: {
            'contentType': contentType
        }
      });
    }

    if (screenPosition) {
      options.push({
        $match: {
            'screenPosition': screenPosition
        }
      });
    }

    if (page && perPage) {
      options.push({
        $project: {
          total: 1,
          results: {
            $slice: ['$results', perPage * (page - 1), perPage]
          }
        }
      });
    }

    return this.aggregate(options).exec();
  },
}

module.exports = mongoose.model('Asset', assetSchema);