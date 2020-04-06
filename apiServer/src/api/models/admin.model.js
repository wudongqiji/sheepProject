const mongoose = require('mongoose');
const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const moment = require('moment');
const jwt = require('jwt-simple');
const APIError = require('../utils/APIError');
const { env, jwtSecret, jwtExpirationInterval } = require('../../config/vars');

/**
* Admin Role
*/
const role_ =['admin', 'organization']

/**
* status
*/
const status_ =['active', 'inactive']

/**
* Type of Access
*/
const access_ =[
    'admin',
    'organizaion',
    'month',
    'spare',
    'branch',
    'device',
    'record',
    'schedule',
]

/**
 * Admin Schema
 * @private
 */
const adminSchema = new mongoose.Schema({
    email: {
        type: String,
        match: /^\S+@\S+\.\S+$/,
        required: true,
        unique: true,
        trim: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 6,
        maxlength: 128,
    },
    role: {
        type: String,
        required: true,
        enum: role_,
    },
    masterAccount: {
        type: Boolean,
    },
    status: {
        type: String,
        required: true,
        enum: status_,
    },
    access: {
        type: [String],
        enum: access_,
    },
    name: {
        type: String,
        trim: true,
    },
    organization: {
        type: String,
        trim: true,
    },
    lastLogin: {
        type: String,
        trim: true,
    },
    setPassword: {
        type: Boolean,
    },
    resetToken: {
        type: String,
    },
}, {
    timestamps: true,
    usePushEach: true
});

/**
 * pre-save hooks | validations | virtuals
 */
adminSchema.pre('save', async function save(next) {
  try {
      if (!this.isModified('password')) return next();

      const rounds = env === 'test' ? 1 : 10;

      const hash = await bcrypt.hash(this.password, rounds);
      this.password = hash;

      return next();
  } catch (error) {
      return next(error);
  }
});

adminSchema.method({
  token() {
      const playload = {
        exp: moment().add(jwtExpirationInterval, 'minutes').unix(),
        iat: moment().unix(),
        sub: this._id,
        email: this.email,
      };
      return jwt.encode(playload, jwtSecret);
  },

  async passwordMatches(password) {
      return bcrypt.compare(password, this.password);
  },
})

/**
 * Statics
 */
adminSchema.statics = {
  role_,
  access_,
  status_,

  async get(id, receiveError = false) {
      try {
          let admin;
          if (mongoose.Types.ObjectId.isValid(id)) {
              admin = await this.findById(id).exec();
          }
          if (admin)
              return admin;
          if (!receiveError) {
              throw new APIError({
                  message: 'Admin does not exist',
                  status: httpStatus.NOT_FOUND
              });
          } else {
              return false;
          }
      } catch (error) {
          throw error;
      }
  },
  async findAndGenerateToken(options) {
      const { email, password, refreshObject } = options;
      if (!email) throw new APIError({ message: 'An email is required to generate a token' });

      const user = await this.findOne({ "email": { $regex : new RegExp(`^${email}$`, "i")} }).exec();
      const err = {
        status: httpStatus.UNAUTHORIZED,
        isPublic: true,
      };
      if (password) {
        if (user && await user.passwordMatches(password)) {
          return { user, accessToken: user.token() };
        }
        err.message = 'Incorrect email or password';
      } else if (refreshObject && refreshObject.userEmail === email) {
        if (moment(refreshObject.expires).isBefore()) {
          err.message = 'Invalid refresh token.';
        } else {
          return { user, accessToken: user.token() };
        }
      } else {
        err.message = 'Incorrect email or refreshToken';
      }
      throw new APIError(err);
  },
  checkDuplicateEmail(error) {
      if (error.name === 'MongoError' && error.code === 11000) {
        return new APIError({
          message: 'Validation Error',
          errors: [{
            field: 'email',
            location: 'body',
            messages: ['"email" already exists'],
          }],
          status: httpStatus.CONFLICT,
          isPublic: true,
          stack: error.stack,
        });
      }
      return error;
  },
  list({ page, perPage, email, name, role, access, organization, lastLogin, status }) {
      const options = [];
      if(email){
          options.push({
              $match: { email: {$regex: email, $options: 'i'} }
          })
      }
      if(name){
          options.push({
              $match: { name: {$regex: name, $options: 'i'} }
          })
      }
      if(role){
          options.push({
              $match: { role }
          })
      }
      if(access){
          options.push({
              $match: { access }
          })
      }
      if(status){
          options.push({
              $match: { status }
          })
      }
      options.push({
          $sort: {
              createdAt: 1
          }
      });
      options.push({
          $project: {
              _id: 1,
              email: 1,
              //password: 1,
              masterAccount: 1,
              role: 1,
              status: 1,
              setPassword: 1,
              resetToken: 1,
              access: 1,
              name: 1,
              organization: 1,
              lastLogin: 1,
              createdAt: 1
          }
      });
      options.push({
          $group: {
              _id: null,
              total: {
                  $sum: 1
              },
              results: {
                  $push: '$$ROOT'
              }
          }
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
  listUniqueAccess(){
      const options = [];
      options.push({
          $unwind: '$access'
      });
      options.push({
          $group: { _id: null, uniqueAccess: {$addToSet: '$access'} }
      });
      return this.aggregate(options).exec();
  },
};

module.exports = mongoose.model('Admin', adminSchema);
