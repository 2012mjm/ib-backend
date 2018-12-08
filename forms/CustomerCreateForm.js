module.exports = {
  attributes: {
    mobile: {
      type: 'string',
      required: true,
      // uniqueValidator: true,
      size: 45
    },
    name: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    phone: {
      type: 'string',
      required: false,
      size: 45,
      defaultsTo: null
    },
    postal_code: {
      type: 'integer',
      required: false,
      size: 11,
      defaultsTo: null
    },
    address: {
      type: 'string',
      required: false,
      size: 255,
      defaultsTo: null
    },
    city_id: {
      type: 'integer',
      required: false,
      index: true,
      size: 11,
      defaultsTo: null,
      model: 'city'
    },
    status: {
      type: 'string',
      required: false,
      enum: ['active', 'inactive', 'banned'],
      defaultsTo: 'inactive'
    },
  },

  // types: {
  //   uniqueValidator: (value) => {
  //     CustomerService.isUniqueMobile(value).then(() => {
  //       return true
  //     }, () => {
  //       return false
  //     })
  //   },
  // },

  // validationMessages: {
  //   mobile: {
  //     uniqueValidator: 'این شماره موبایل قبلا ثبت شده است.',
  //   }
  // }
};