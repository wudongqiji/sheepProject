const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

const _status = ['online', 'maintenance', 'error'];

/**
 * Organization Schema
 * @private
 */
const organizationSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  tel: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  email: {
    type: String,
    match: /^\S+@\S+\.\S+$/,
    required: true,
    unique: true,
    trim: true,
  },
  remark: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
}, {
  timestamps: true,
});

/**
 * Statics
 */
organizationSchema.statics = {
  async get(id, receiveError = false){
    try{
      let organization;
      if(mongoose.Types.ObjectId.isValid(id)){
        organization = await this.findById(id, {__v: 0}).exec();
      }
      if(organization)
        return organization;
      if(!receiveError){
        throw new APIError({
          message: 'Organization does not exist',
          status: httpStatus.NOT_FOUND
        });
      }else{
        return false;
      }
    }catch(error){
      throw error;
    }

  },
  list({page = null, perPage = null, name = null}, query) {
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
        name: 1,
        tel: 1,
        email: 1,
        remark: 1,
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

    if (name) {
      options.push({
          $match: {
              $or: [
                  { 'name': { $regex: name, $options: 'i'} },
              ]
          }
      })
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

module.exports = mongoose.model('Organization', organizationSchema);