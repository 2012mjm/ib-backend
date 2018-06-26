module.exports = {
  attributes: {
    subcategoryId: {
      type: 'integer',
      required: true,
    },
    storeId: {
      type: 'integer',
      required: true
    },
    name: {
      type: 'string',
      required: true,
    },
    description: {
      type: 'string',
      required: false,
    },
    price: {
      type: 'integer',
      required: true
    },
    quantity: {
      type: 'integer',
      required: true
    },
    weight: {
      type: 'decimal',
      required: false
    }
  },
};