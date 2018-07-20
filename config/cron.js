module.exports.cron = {
    expiryInvoice: {
        schedule: '1 */10 * * * *',
        onTick: function () {
            InvoiceService.expiryCron().then(res => {
                console.log('expiryInvoice :: resolve', res)
            }, err => {
                console.log('expiryInvoice :: reject', err)
            })
        }
    },
    expiryMobileVerifyCustomer: {
        schedule: '1 1 */1 * * *',
        onTick: function () {
            CustomerService.expiryMobileVerifyCron().then(res => {
                console.log('expiryMobileVerifyCustomer :: resolve', res)
            }, err => {
                console.log('expiryMobileVerifyCustomer :: reject', err)
            })
        }
    }
}