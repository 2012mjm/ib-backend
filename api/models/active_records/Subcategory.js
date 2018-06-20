/**
 * Subcategory.js
 *
 * @description :: The Subcategory table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'subcategory',
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
    name: {
      type: 'string',
      required: true,
      size: 45
    },
    photoId: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null,
      model: 'file'
    }
  }
};