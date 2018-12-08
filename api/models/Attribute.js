/**
 * Attribute.js
 *
 * @description :: The Attribute table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'attribute',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    key: {
      type: 'string',
      required: true,
      size: 45
    },
    titleFa: {
      type: 'string',
      required: true,
      size: 45
    },
    titleEn: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    }
  }
};