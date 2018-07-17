os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')
const md5 = require('md5')

const zarinpalCheckout = require('zarinpal-checkout')
const zarinpal = zarinpalCheckout.create(sails.config.params['zarinpalMerchantId'], sails.config.params['zarinpalSandbox']);

const self = module.exports = {
    add: (customerId, invoiceId, amount) => {
        return new Promise((resolve, reject) =>
        {
            self.create(customerId, invoiceId, amount).then(({payment}) => {
                self.zarinpalRequest(payment.amount, payment.trackingCode).then(resolve, reject)
            }, reject)
        })
    },

    create: (customerId, invoiceId, amount, type) => {
        return new Promise((resolve, reject) =>
        {
            Payment.create({
                customerId: customerId,
                invoiceId: invoiceId,
                amount: amount,
                type: type || 'online',
                trackingCode: md5(`ib${Date.now()}zarinpal`),
                createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
            }).exec((err, model) => {
                if (err || !model) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
                resolve({messages: ['تراکنش با موفقیت ایجاد شد.'], payment: model})
            })
        })
    },

    findByTrackingCode: (trackingCode, where={}) => {
        return new Promise((resolve, reject) =>
        {
            Payment.findOne({...where, trackingCode}).exec((err, model) => {
                if(err || !model) return reject(err)
                resolve(model)
            })
        })
    },

    findNotPaidByTrackingCode: (trackingCode) => {
        return new Promise((resolve, reject) =>
        {
            self.findByTrackingCode(trackingCode, {status: null}).then(resolve, reject)
        })
    },

    zarinpalRequest: (amount, trackingCode, description) => {
        return new Promise((resolve, reject) =>
        {
            zarinpal.PaymentRequest({
                Amount: amount, // In Tomans
                CallbackURL: `${sails.config.params['apiUrl']}/api/v1/payment/verify/${trackingCode}`,
                Description: description || 'ایرانی بخریم',
                Email: sails.config.params['adminEmail'],
                Mobile: sails.config.params['adminMobile']
            }).then(response => {
                if (response.status === 100) return resolve(response.url)
                reject(response)
            }).catch(err => {
                reject('مشکلی در ارتباط با درگاه پرداخت به وجود آمده است، با پشتیبانی تماس حاصل فرمایید.')
            })
        })
    },

    zarinpalVerify: (amount, authority) => {
        return new Promise((resolve, reject) =>
        {
            zarinpal.PaymentVerification({
                Amount: amount, // In Tomans
                Authority: authority,
            }).then(response => {
                if (response.status === 101) return resolve(response)
                reject(response)
            }).catch(err => {
                reject(err)
            })
        })
    },

    update: (id, attr) => {
      return new Promise((resolve, reject) => {
        Payment.update(id, attr).exec((err, model) => {
          if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
          resolve({messages: ['تغییرات ذخیره شد.'], payment: model[0]})
        })
      })
    },
}