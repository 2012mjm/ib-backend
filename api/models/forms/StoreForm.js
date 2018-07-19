const FileValidator = require('../../../helper/FileValidator')

module.exports = {
  attributes: {
    mobile: {
      type: 'string',
      required: false,
    },
    password: {
      type: 'string',
      required: false
    },
    email: {
      type: 'email',
      required: false,
    },
    store_name_fa: {
      type: 'string',
      required: false,
    },
    store_name_en: {
      type: 'string',
      required: false,
      size: 45,
    },
    owner_fa: {
      type: 'string',
      required: false,
      size: 45,
    },
    owner_en: {
      type: 'string',
      required: false,
      size: 45,
    },
    slogan_fa: {
      type: 'string',
      required: false,
      size: 255,
    },
    slogan_en: {
      type: 'string',
      required: false,
      size: 255,
    },
    description_fa: {
      type: 'text',
      required: false,
    },
    description_en: {
      type: 'text',
      required: false,
    },
    status: {
      type: 'string',
      required: false,
      enum: ['active', 'inactive', 'deleted'],
    },
    logo: {
      logoSize: true,
      logoType: true,
    }
  },

  types: {
    logoSize: (value) => {
      return FileValidator.type(value, ['image/jpeg', 'image/png', 'image/gif'])
    },
    logoType: (value) => {
      return FileValidator.size(value, 50*1024*1024)
    },
  },

  validationMessages: {
    logo: {
      logoType: 'file type alowed is jpg, gif and png',
      logoSize: 'size largest 50MB',
    }
  }
};