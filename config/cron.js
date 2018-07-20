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
    }
}