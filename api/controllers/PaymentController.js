module.exports = {

	verify: (req, res) => {
		const trackingCode 	= req.param('trackcode')
		const authority 	= req.param('Authority')
		const status 		= req.param('Status')

		PaymentService.findNotPaidByTrackingCode(trackingCode).then(payment => {
			PaymentService.zarinpalVerify(payment.amount, authority).then(zarinpalResult => {
				PaymentService.update(payment.id, {reffererCode: zarinpalResult.RefID, statusCode: zarinpalResult.status, status}).then(result => {
					InvoiceService.paid(payment.invoiceId).then(() => {
						res.redirect(`ibapp://payment?status=success&invoice_id=${payment.invoiceId}`)
					}, err => {
						console.log(err)
						res.redirect(`ibapp://payment?status=error`)
					})
				}, err => {
					console.log(err)
					res.redirect(`ibapp://payment?status=error`)
				})
			}, err => {
				console.log(err)
				res.redirect(`ibapp://payment?status=error`)
			})
		}, err => {
			console.log(err)
			res.redirect(`ibapp://payment?status=error`)
		})
	},
}

