/**
 * File.js
 *
 * @description :: The File table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'file',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string',
      required: true,
      size: 128
    },
    path: {
      type: 'string',
      required: true,
      size: 128
    },
    type: {
      type: 'string',
      required: true,
      enum: ['image', 'video', 'document'],
      defaultsTo: 'image'
    }
  }
};