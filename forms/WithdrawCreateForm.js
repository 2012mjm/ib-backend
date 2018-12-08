module.exports = {
  attributes: {
    store_id: {
      type: 'integer',
      required: true,
      index: true,
      size: 11,
      model: 'store'
    },
    amount: {
      type: 'integer',
      required: true,
      size: 20,
    },
    account_owner: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    bank_name: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    card_number: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    account_number: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    shaba_number: {
      type: 'string',
      required: false,
      size: 128,
      defaultsTo: null
    },
    status: {
      type: 'string',
      required: false,
      defaultsTo: 'pending'
    }
  },
};