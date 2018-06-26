/**
 * SecondSubcategory.js
 *
 * @description :: The SecondSubcategory table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'secondSubcategory',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    subcategoryId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'subcategory'
    },
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
    }
  }
};