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
    store_name: {
      type: 'string',
      required: true,
    }
  },
};