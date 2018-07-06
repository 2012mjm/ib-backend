/**
 * Invoice.js
 *
 * @description :: The Invoice table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'invoice',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    customerId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'customer'
    },
    number: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null,
      unique: true,
    },
    cityId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'city'
    },
    address: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    postalCode: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    phone: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    createdAt: {
      type: 'datetime',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      enum: ['draft','pending','accepted','rejected']
    },
    reasonRejected: {
      type: 'text',
      required: false,
      defaultsTo: null
    }
  }
};