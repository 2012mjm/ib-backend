module.exports = {

	list: (req, res) => {
		if(req.token.role === 'manager') {
			InvoiceService.listByManager({
					status: req.param('status', null),
				},
				req.param('page', 1),
				req.param('count', 10),
				req.param('sort', 'createdAt DESC')
			).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else if(req.token.role === 'customer') {
			InvoiceService.listByCustomer({
					status: 	req.param('status', null),
					customerId: req.token.customerId,
				},
				req.param('page', 1),
				req.param('count', 10),
				req.param('sort', 'createdAt DESC')
			).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
	},

	verify: (req, res) => {
		if(['customer'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		InvoiceService.verify(req.body.invoice_id, req.token.customerId).then((result) => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}