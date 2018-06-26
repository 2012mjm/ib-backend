/**
 * Product_photo.js
 *
 * @description :: The Product_photo table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product_photo',
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
    fileId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'file'
    },
    isMain: {
      type: 'integer',
      required: true,
      size: 1,
      defaultsTo: '0'
    }
  }
};