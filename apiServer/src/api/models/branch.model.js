const mongoose = require('mongoose');
const httpStatus = require('http-status');
const APIError = require('../utils/APIError');

/**
* Branch District
*/
const _district = [
  '京士柏',
  '香港天文台',
  '黃竹坑',
  '打鼓嶺',
  '流浮山',
  '大埔',
  '沙田',
  '屯門',
  '將軍澳',
  '西貢',
  '長洲',
  '赤鱲角',
  '青衣',
  '石崗',
  '荃灣可觀',
  '荃灣城門谷',
  '香港公園',
  '筲箕灣',
  '九龍城',
  '跑馬地',
  '黃大仙',
  '赤柱',
  '觀塘',
  '深水埗',
  '啟德跑道公園',
  '元朗公園',
  '大美督'
];

/**
 * Branch Schema
 * @private
 */
const branchSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    enum: _district,
  },
  location: {
    type: String,
    maxlength: 128,
    index: true,
    trim: true,
    required: true,
  },
}, {
  timestamps: true,
});

/**
 * Methods
 */
branchSchema.method({
  transform() {
    let transformed = {};
    const fields = ['_id', 'name', 'district', 'location', 'createdAt'];

    fields.forEach((field) => {
      transformed[field] = this[field];
    });

    return transformed;
  },
});

/**
 * Statics
 */
branchSchema.statics = {
  async get(id, receiveError = false){
    try{
      let branch;
      if(mongoose.Types.ObjectId.isValid(id)){
        branch = await this.findById(id, {__v: 0}).exec();
      }
      if(branch)
        return branch;
      if(!receiveError){
        throw new APIError({
          message: 'Branch does not exist',
          status: httpStatus.NOT_FOUND
        });
      }else{
        return false;
      }
    }catch(error){
      throw error;
    }

  },
  list({page = null, perPage = null}, query) {
    const options = [];
    if(query){
      options.push({
        $match: query
      });
    }

    options.push({
      $project: {
        _id: 1,
        name: 1,
        district: 1,
        location: 1,
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

module.exports = mongoose.model('Branch', branchSchema);