/**
 * Product_attribute.js
 *
 * @description :: The Product_attribute table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'product_attribute',
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
    attributeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'attribute'
    },
    attributeValueId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'attributeValue'
    },
    value: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    increasePrice: {
      type: 'integer',
      required: false,
      size: 20,
      defaultsTo: null
    },
    discount: {
      type: 'integer',
      required: false,
      size: 20,
      defaultsTo: null
    },
    quantity: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    }
  }
};