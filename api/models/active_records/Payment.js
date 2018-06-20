/**
 * Payment.js
 *
 * @description :: The Payment table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'payment',
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
    invoiceId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'invoice'
    },
    trackingCode: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    reffererCode: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    amount: {
      type: 'integer',
      required: true,
      size: 20
    },
    statusCode: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    type: {
      type: 'string',
      required: true,
      enum: ['online', 'cash', 'POS'],
      defaultsTo: 'online'
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};