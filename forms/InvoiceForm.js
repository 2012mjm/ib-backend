module.exports = {
  attributes: {
    cart: {
      type: 'array',
      required: true
    },
    address: {
      type: 'string',
      required: true
    },
    name: {
      type: 'string',
      required: true
    },
    postal_code: {
      type: 'string',
      required: true
    },
    phone: {
      type: 'string',
      required: true
    },
    city_id: {
      type: 'integer',
      required: true
    },
    latitude: {
      type: 'string',
      required: false
    },
    longitude: {
      type: 'string',
      required: false
    },
  },
};