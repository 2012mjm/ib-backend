/**
 * Order.js
 *
 * @description :: The Order table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'order',
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
    storeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    invoiceId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'invoice'
    },
    productId: {
      type: 'integer',
      required: true,
      size: 11,
      model: 'product'
    },
    price: {
      type: 'integer',
      required: true,
      size: 20
    },
    count: {
      type: 'integer',
      required: true,
      size: 11,
      defaultsTo: '1'
    },
    weight: {
      type: 'decimal',
      required: false,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: true,
      enum: ['pending','sent','rejected']
    },
    reasonRejected: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};