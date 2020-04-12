const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const _status = ['online', 'maintenance', 'error', 'offline'];

/**
 * Device Schema
 * @private
 */
const deviceSchema = new mongoose.Schema({
  branchId: {
    type: String,
    trim: true,
  },
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  deviceSerialNum: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    unique: true,
  },
  remark: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  status: {
    type: String,
    enum: _status,
    default: 'offline',
  },
  activated: {
    type: Boolean,
    default: false,
  },
  activatedCode: {
    type: String,
    trim: true,
  }
}, {
  timestamps: true,
});

/**
 * Statics
 */
deviceSchema.statics = {
  async get(id, receiveError = false){
    try{
      let device;
      if(mongoose.Types.ObjectId.isValid(id)){
        device = await this.findById(id, {__v: 0}).exec();
      }
      if(device)
        return device;
      if(!receiveError){
        throw new APIError({
          message: 'Device does not exist',
          status: httpStatus.NOT_FOUND
        });
      }else{
        return false;
      }
    }catch(error){
      throw error;
    }

  },
  checkDuplicateDeviceSerialNum(error) {
    if (error.name === 'MongoError' && error.code === 11000) {
      return new APIError({
        message: 'Validation Error',
        errors: [{
          field: 'deviceSerialNum',
          location: 'body',
          messages: ['"deviceSerialNum" already exists'],
        }],
        status: httpStatus.CONFLICT,
        isPublic: true,
        stack: error.stack,
      });
    }
    return error;
  },
  list({page = null, perPage = null, status = null, branchId = null, activated = null}, query) {
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

    if (status) {
      options.push({
        $match: {
            'status': status
        }
      });
    }

    if (branchId) {
      options.push({
        $match: {
          'branchId': branchId
        }
      });
    }

    if (activated !== null) {
      options.push({
        $match: {
          'activated': activated
        }
      });
    }

    options.push({
      $project: {
        _id: 1,
        branchId: 1,
        name: 1,
        deviceSerialNum: 1,
        remark: 1,
        status: 1,
        activated: 1,
        activatedCode: 1,
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

module.exports = mongoose.model('Device', deviceSchema);