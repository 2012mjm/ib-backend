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
    nameFa: {
      type: 'string',
      required: true,
      size: 45
    },
    nameEn: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    photoId: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    }
  }
};