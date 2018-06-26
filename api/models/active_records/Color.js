/**
 * Color.js
 *
 * @description :: The Color table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'color',
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
    code: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    photoId: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    }
  }
};