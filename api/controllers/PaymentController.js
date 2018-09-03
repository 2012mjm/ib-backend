module.exports = {

	verify: (req, res) => {
		const trackingCode 	= req.param('trackcode')
		const authority 	= req.param('Authority')
		const status 		= req.param('Status')

		PaymentService.findNotPaidByTrackingCode(trackingCode).then(payment => {
			PaymentService.zarinpalVerify(payment.amount, authority).then(zarinpalResult => {
				PaymentService.update(payment.id, {reffererCode: zarinpalResult.RefID, statusCode: zarinpalResult.status, status}).then(result => {
					InvoiceService.update(payment.invoiceId, {status: 'paid'}).then(() => {
						res.redirect(`ibapp://link/invoice/${payment.invoiceId}`)
					}, err => {
						res.redirect(`ibapp://link/invoice/${payment.invoiceId}`)
					})
				}, err => {
					res.redirect(`ibapp://link/invoice/${payment.invoiceId}`)
				})
			}, err => {
				InvoiceService.update(payment.invoiceId, {status: 'rejected', reasonRejected: 'پرداخت توسط مشتری لغو شده است.'}).then(() => {}).catch(() => {})
				res.redirect(`ibapp://link/invoice/${payment.invoiceId}`)
			})
		}, err => {
			res.redirect(`ibapp://link/invoice`)
		})
	},
}

