/**
 * Product_star.js
 *
 * @description :: The Product_star table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product_star',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
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
    vote: {
      type: 'integer',
      required: true,
      size: 11
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};