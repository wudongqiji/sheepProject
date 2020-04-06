const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const _status = ['active', 'inactive', 'complete'];

/**
 * Advertisement Schema
 * @private
 */
const advertisementSchema = new mongoose.Schema({
  companyId: {
    type: String,
    trim: true,
  },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  quota: {
    type: Number,
    required: true,
  },
  branchIds: {
    type: [String],
    required: true,
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
advertisementSchema.statics = {
  async get(id, receiveError = false){
    try{
      let advertisement;
      if(mongoose.Types.ObjectId.isValid(id)){
        advertisement = await this.findById(id, {__v: 0}).exec();
      }
      if(advertisement)
        return advertisement;
      if(!receiveError){
        throw new APIError({
          message: 'Advertisement does not exist',
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
        companyId: 1,
        startDate: 1,
        endDate: 1,
        quota: 1,
        branchIds: 1,
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
          branchIds: {
            $in: [branchId]
          }
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

module.exports = mongoose.model('Advertisement', advertisementSchema);