const FileValidator = require('../../../helper/FileValidator')

module.exports = {
  attributes: {
    type: {
      type: 'string',
      required: true,
      enum: ['slide', 'wide', 'small'],
    },
    image: {
      photoRequired: true,
      photoSize: true,
      photoType: true,
    },
    link_type: {
      type: 'string',
      required: false,
      enum: ['category', 'product', 'url'],
    },
    link: {
      type: 'string',
      required: false,
      size: 255
    },
  },

  types: {
    photoRequired: (value) => {
      return FileValidator.required(value)
    },
    photoSize: (value) => {
      return FileValidator.type(value, ['image/jpeg', 'image/png', 'image/gif'])
    },
    photoType: (value) => {
      return FileValidator.size(value, 50*1024*1024)
    },
  },

  validationMessages: {
    photo: {
      photoRequired: 'this is required',
      photoType: 'file type alowed is jpg, gif and png',
      photoSize: 'size largest 50MB',
    }
  }
};