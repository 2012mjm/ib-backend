/**
 * Banner.js
 *
 * @description :: The Banner table
 * @docs        :: http://sailsjs.org/#!documentation/models
 */

module.exports = {
  tableName: 'banner',
  autoCreatedAt: false,
  autoUpdatedAt: false,
  attributes: {
    type: {
      type: 'string',
      required: true,
      enum: ['slide', 'wide', 'small'],
    },
    imageId: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'file'
    },
    linkType: {
      type: 'string',
      required: false,
      enum: ['category', 'product', 'url'],
    },
    link: {
      type: 'string',
      required: false,
      size: 255
    },
  }
};