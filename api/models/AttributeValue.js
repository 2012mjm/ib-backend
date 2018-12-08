/**
 * Attribute_value.js
 *
 * @description :: The Attribute_value table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'attribute_value',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    attributeId: {
      type: 'integer',
      required: true,
      size: 11,
      model: 'attribute'
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
    },
    value: {
      type: 'text',
      required: false,
      defaultsTo: null
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