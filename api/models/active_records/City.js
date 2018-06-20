/**
 * City.js
 *
 * @description :: The City table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'city',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    provinceId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'province'
    },
    name: {
      type: 'integer',
      required: true,
      size: 11
    }
  }
};