module.exports = {
  attributes: {
    category_id: {
      type: 'integer',
      required: true,
    },
    attribute_id: {
      type: 'integer',
      required: true,
    },
    is_required: {
      type: 'integer',
      required: false,
    },
    is_multiple: {
      type: 'integer',
      required: false,
    }
  },
};