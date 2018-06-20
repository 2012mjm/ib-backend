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
    email: {
      type: 'email',
      required: true,
    }
  },
};