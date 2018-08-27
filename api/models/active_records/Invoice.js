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
    amount: {
      type: 'integer',
      required: true,
      size: 20
    },
    shippingCost: {
      type: 'integer',
      required: false,
      size: 10,
      defaultsTo: 0,
    },
    shippingType: {
      type: 'string',
      required: false,
      enum: ['payment-at-place','online','free']
    },
    shippingMethod: {
      type: 'string',
      required: false,
      enum: ['bike-delivery','pickup-truck']
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
    latitude: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null,
    },
    longitude: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null,
    },
    phone: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    name: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    createdAt: {
      type: 'datetime',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      enum: ['pending','accepted','paid','sent','sent-final','rejected']
    },
    reasonRejected: {
      type: 'text',
      required: false,
      defaultsTo: null
    }
  }
};