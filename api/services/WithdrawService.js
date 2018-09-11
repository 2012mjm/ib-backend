const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Withdraw.create({
        storeId: attr.store_id,
        amount: attr.amount,
        accountOwner: attr.account_owner || null,
        bankName: attr.bank_name || null,
        cardNumber: attr.card_number || null,
        accountNumber: attr.account_number || null,
        shabaNumber: attr.shaba_number || null,
        status: attr.status || 'pending',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec((err, model) => {
        if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')

        if (model) {
          resolve({messages: ['درخواست جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },
}
