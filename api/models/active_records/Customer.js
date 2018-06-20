/**
 * Customer.js
 *
 * @description :: The Customer table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'customer',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    mobile: {
      type: 'string',
      required: true,
      size: 45
    },
    password: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    name: {
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
    postalCode: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    address: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    cityId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'city'
    },
    isVerifiedMobile: {
      type: 'integer',
      required: true,
      size: 1,
      defaultsTo: '0'
    },
    mobileKey: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    expiryMobileKey: {
      type: 'datetime',
      required: false,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: true,
      enum: ['active', 'inactive', 'banned'],
      defaultsTo: 'inactive'
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};