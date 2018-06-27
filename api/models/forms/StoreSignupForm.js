module.exports = {
  attributes: {
    mobile: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true
    },
    email: {
      type: 'email',
      required: false,
    },
    store_name_fa: {
      type: 'string',
      required: true,
    },
    store_name_en: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    owner_fa: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    owner_en: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    description_fa: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
    description_en: {
      type: 'text',
      required: false,
      defaultsTo: null
    },
  },
};