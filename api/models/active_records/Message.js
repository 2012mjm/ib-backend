/**
 * Message.js
 *
 * @description :: The Message table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'message',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    email: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    subject: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    message: {
      type: 'text',
      required: true
    },
    source: {
      type: 'string',
      required: true,
      enum: ['site', 'app']
    },
    createdAt: {
      type: 'date',
      required: true
    }
  }
};