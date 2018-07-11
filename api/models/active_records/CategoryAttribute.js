/**
 * Category_attribute.js
 *
 * @description :: The Category_attribute table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'category_attribute',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    categoryId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'category'
    },
    attributeId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'attribute'
    },
    isRequired: {
      type: 'integer',
      required: true,
      size: 1,
      defaultsTo: '0'
    },
    isMultiple: {
      type: 'integer',
      required: true,
      size: 1,
      defaultsTo: '0'
    }
  }
};