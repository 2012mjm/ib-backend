/**
 * Manager.js
 *
 * @description :: The Manager table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
const bcrypt = require('bcrypt')

module.exports = {
  tableName: 'manager',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    username: {
      type: 'string',
      required: true,
      unique: true,
      size: 128
    },
    password: {
      type: 'string',
      required: true,
      size: 256
    },
    email: {
      type: 'string',
      required: true,
      unique: true,
      size: 256
    },
    avatarId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'file'
    },
    mobile: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    phone: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: true,
      enum: ['active', 'inactive'],
      defaultsTo: 'active'
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  },

  // Here we encrypt password before creating a User 
  beforeCreate : function (values, next) {
    bcrypt.genSalt(10, function (err, salt) {
      if(err) return next(err);
      bcrypt.hash(values.password, salt, function (err, hash) {
        if(err) return next(err);
        values.password = hash;
        next();
      })
    })
  },
  comparePassword : function (password, user, cb) {
    bcrypt.compare(password, user.password, function (err, match) {
      if(err) cb(err);
      if(match) {
        cb(null, true);
      } else {
        cb(err);
      }
    })
  }
};