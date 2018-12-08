module.exports = {
  attributes: {
    attribute_id: {
      type: 'integer',
      required: true,
      size: 11,
      model: 'attribute'
    },
    title_fa: {
      type: 'string',
      required: true,
      size: 45
    },
    title_en: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    value: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    photo: {
      photoSize: true,
      photoType: true,
    }
  },

  types: {
    photoSize: (value) => {
      return FileValidator.type(value, ['image/jpeg', 'image/png', 'image/gif'])
    },
    photoType: (value) => {
      return FileValidator.size(value, 50*1024*1024)
    },
  },

  validationMessages: {
    photo: {
      photoType: 'file type alowed is jpg, gif and png',
      photoSize: 'size largest 50MB',
    }
  }
};