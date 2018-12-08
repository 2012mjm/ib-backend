module.exports = {
  attributes: {
    id: {
      type: 'integer',
      required: true,
    },
    name: {
      type: 'string',
      required: false,
      size: 45,
    },
    phone: {
      type: 'string',
      required: false,
      size: 45,
    },
    postal_code: {
      type: 'integer',
      required: false,
      size: 11,
    },
    address: {
      type: 'string',
      required: false,
      size: 255,
    },
    city_id: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      model: 'city'
    },
    addresses: {
      type: 'text',
      required: false,
    },
    status: {
      type: 'string',
      required: false,
      enum: ['active', 'inactive', 'banned'],
    },
  },
};