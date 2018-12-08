/**
 * Product_comment.js
 *
 * @description :: The Product_comment table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product_comment',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    productId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'product'
    },
    customerId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'customer'
    },
    star: {
      type: 'decimal',
      required: false,
      defaultsTo: null
    },
    content: {
      type: 'text',
      required: true
    },
    status: {
      type: 'string',
      required: true,
      size: 45,
      defaultsTo: 'pending'
    },
    reasonRejected: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};