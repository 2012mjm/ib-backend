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