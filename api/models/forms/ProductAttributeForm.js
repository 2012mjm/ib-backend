module.exports = {
  attributes: {
    product_id: {
      type: 'integer',
      required: true,
    },
    attribute_id: {
      type: 'integer',
      required: true,
    },
    attribute_value_id: {
      type: 'integer',
      required: false,
    },
    value: {
      type: 'string',
      required: false,
    },
    increase_price: {
      type: 'integer',
      required: false,
    },
    discount: {
      type: 'integer',
      required: false,
    },
    quantity: {
      type: 'integer',
      required: false,
    },
  },
};