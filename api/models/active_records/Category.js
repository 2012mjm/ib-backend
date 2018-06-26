/**
 * Category.js
 *
 * @description :: The Category table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'category',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
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
    },
    color: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    }
  }
};