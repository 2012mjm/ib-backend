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
    storeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    categoryId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'category'
    },
    nameFa: {
      type: 'string',
      required: true,
      size: 128
    },
    nameEn: {
      type: 'string',
      required: false,
      size: 128,
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
    price: {
      type: 'integer',
      required: true,
      size: 20
    },
    discount: {
      type: 'integer',
      required: false,
      size: 20,
      defaultsTo: null
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
    dimensions: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    star: {
      type: 'decimal',
      required: true,
      defaultsTo: '0.00'
    },
    visit: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    sale: {
      type: 'integer',
      required: true,
      defaultsTo: 0
    },
    status: {
      type: 'string',
      required: true,
      enum: ['pending', 'accepted', 'rejected', 'deleted'],
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
    },
    updatedAt: {
      type: 'datetime',
      required: false,
      defaultsTo: null
    }
  }
};