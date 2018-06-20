/**
 * Store.js
 *
 * @description :: The Store table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'store',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    id: {
      type: 'integer',
      required: true,
      autoIncrement: true,
      primaryKey: true,
      size: 11
    },
    mobile: {
      type: 'string',
      required: true,
      unique: true,
      size: 45
    },
    password: {
      type: 'string',
      required: true,
      size: 128
    },
    email: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    owner: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    name: {
      type: 'string',
      required: true,
      size: 45
    },
    description: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    logoId: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'file'
    },
    createdAt: {
      type: 'datetime',
      required: true
    }
  }
};