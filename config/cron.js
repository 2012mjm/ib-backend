module.exports.cron = {
    expiryInvoice: {
        schedule: '1 */10 * * * *', // each 10 minutes
        onTick: function () {
            InvoiceService.expiryCron().then(res => {
                console.log('expiryInvoice :: resolve', res)
            }, err => {
                console.log('expiryInvoice :: reject', err)
            })
        }
    },
    expiryMobileVerifyCustomer: {
        schedule: '1 1 */1 * * *', // each hour
        onTick: function () {
            CustomerService.expiryMobileVerifyCron().then(res => {
                console.log('expiryMobileVerifyCustomer :: resolve', res)
            }, err => {
                console.log('expiryMobileVerifyCustomer :: reject', err)
            })
        }
    },
    checkoutWithSeller: {
        schedule: '1 1 1 */1 * *', // each night
        onTick: function () {
            StoreService.checkoutCron().then(res => {
                console.log('checkoutCron :: resolve', res)
            }, err => {
                console.log('checkoutCron :: reject', err)
            })
        }
    }
}