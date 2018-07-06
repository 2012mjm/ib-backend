os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')
const md5 = require('md5')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Invoice.create({
        customerId: attr.customer_id,
        number: md5(Date.now()),
        cityId: attr.city_id || null,
        address: attr.address || null,
        postalCode: attr.postal_code || null,
        phone: attr.phone || null,
        status: attr.status || 'draft',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec((err, model) => {

        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }

        if (model) {
          resolve({messages: ['صورت‌حساب جدید با موفقیت ایجاد شد.'], invoice: model})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },
}

