module.exports = {
  attributes: {
    key: {
      type: 'string',
      required: true,
      size: 45
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
    }
  },
};