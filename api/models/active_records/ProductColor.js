/**
 * Product_color.js
 *
 * @description :: The Product_color table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product_color',
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
    colorId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'color'
    }
  }
};