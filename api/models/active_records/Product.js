/**
 * Product.js
 *
 * @description :: The Product table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    subcategoryId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'subcategory'
    },
    storeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    photoId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'file'
    },
    name: {
      type: 'string',
      required: true,
      size: 128
    },
    description: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    price: {
      type: 'integer',
      required: true,
      size: 20
    },
    quantity: {
      type: 'integer',
      required: true,
      size: 11
    },
    weight: {
      type: 'decimal',
      required: false,
      defaultsTo: null
    },
    star: {
      type: 'integer',
      required: true,
      size: 11,
      defaultsTo: '0'
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