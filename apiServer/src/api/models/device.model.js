const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const _status = ['online', 'maintenance', 'error'];

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
  list({page = null, perPage = null, status = null, branchId = null}, query) {
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
        branchId: 1,
        name: 1,
        deviceSerialNum: 1,
        remark: 1,
        status: 1,
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