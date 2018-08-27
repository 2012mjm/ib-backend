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
		else if(req.token.role === 'store') {
			InvoiceService.listByStore({
					status: req.param('status', null),
				},
				req.token.storeId,
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

	info: (req, res) => {
		if(req.token.role === 'manager') {
			InvoiceService.infoByManager(req.param('id', null)).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else if(req.token.role === 'customer') {
			InvoiceService.infoByCustomer(req.param('id', null), req.token.customerId).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else if(req.token.role === 'store') {
			InvoiceService.infoByStore({id: req.param('id')}, req.token.storeId).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
	},

	add: (req, res) => {
		if(['customer', 'manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.token.role === 'customer') {
			req.body.customer_id = req.token.customerId
			delete req.body.status
		}
		InvoiceForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			InvoiceService.add(req.body).then(invoice =>
			{
				OrderService.add(req.body.cart, invoice).then(result =>
				{
					InvoiceService.calculateAndUpdate(invoice.id, result.invoice.total, result.orders).then(({invoice}) =>
					{
						result.invoice.shipping_cost = invoice.shippingCost
						result.invoice.shipping_type = invoice.shippingType

						PaymentService.add(invoice.customerId, invoice.id, invoice.amount + invoice.shippingCost).then(url =>
						{
							return res.json(200, {...result, payment_url: url, messages: ['صورتحساب شما صادر شد.']})
						}, err => {
							return res.json(422, ErrorService.filter(err))
						})
					}, err => {
						return res.json(422, ErrorService.filter(err))
					})
				}, err => {
					return res.json(422, ErrorService.filter(err))
				})
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	verify: (req, res) => {
		if(['customer'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		InvoiceService.check(req.param('id'), req.token.customerId).then(result => {
			return res.json(200, result)
		}, err => {
			return res.json(422, ErrorService.filter(err))
		})
	}
}