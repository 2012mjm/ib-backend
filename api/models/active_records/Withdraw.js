/**
 * Withdraw.js
 *
 * @description :: The Withdraw table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'withdraw',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    storeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    amount: {
      type: 'integer',
      required: true,
      size: 20
    },
    accountOwner: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    bankName: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    cardNumber: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    accountNumber: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    shabaNumber: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    receiptPayment: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    reasonRejected: {
      type: 'string',
      required: false,
      size: 255
    },
    status: {
      type: 'string',
      required: true,
      enum: ['pending', 'accepted', 'rejected'],
      defaultsTo: 'pending'
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};