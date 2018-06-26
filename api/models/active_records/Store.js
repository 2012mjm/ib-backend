/**
 * Store.js
 *
 * @description :: The Store table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */
const bcrypt = require('bcrypt')

module.exports = {
  tableName: 'store',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    mobile: {
      type: 'string',
      required: true,
      unique: true,
      size: 45
    },
    password: {
      type: 'string',
      required: true,
      size: 128
    },
    email: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    ownerFa: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    ownerEn: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    nameFa: {
      type: 'string',
      required: true,
      size: 45
    },
    nameEn: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    descriptionFa: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    descriptionEn: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    logoId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'file'
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