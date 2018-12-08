/**
 * Province.js
 *
 * @description :: The Province table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'province',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string',
      required: true,
      size: 45
    }
  }
};