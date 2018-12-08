module.exports = {
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
  }
};