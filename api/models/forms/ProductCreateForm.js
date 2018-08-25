module.exports = {
  attributes: {
    store_id: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    category_id: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'category'
    },
    name_fa: {
      type: 'string',
      required: true,
      size: 128
    },
    name_en: {
      type: 'string',
      required: false,
      size: 128,
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
    price: {
      type: 'integer',
      required: true,
      size: 20
    },
    discount: {
      type: 'integer',
      required: false,
      size: 20,
      defaultsTo: null
    },
    quantity: {
      type: 'integer',
      required: true,
      size: 11
    },
    weight: {
      type: 'decimal',
      required: false,
      defaultsTo: null
    },
    dimensions: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: false,
      defaultsTo: 'pending'
    }
  },
};