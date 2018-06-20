module.exports = {
  attributes: {
    username: {
      type: 'string',
      required: true,
    },
    password: {
      type: 'string',
      required: true
    },
    remember_me: {
      type: 'boolean',
      defaultsTo: false,
    }
  },
};