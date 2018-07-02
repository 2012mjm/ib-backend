const FileValidator = require('../../../helper/FileValidator')

module.exports = {
  attributes: {
    product_id: {
      type: 'integer',
      required: true,
    },
    photo: {
      photoRequired: true,
      photoSize: true,
      photoType: true,
    }
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
    file: {
      photoRequired: 'this is required',
      photoType: 'file type alowed is jpg, gif and png',
      photoSize: 'size largest 50MB',
    }
  }
};