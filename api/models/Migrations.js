/**
 * Migrations.js
 *
 * @description :: The Migrations table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'migrations',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    name: {
      type: 'string',
      required: true,
      size: 255
    },
    run_on: {
      type: 'datetime',
      required: true
    }
  }
};