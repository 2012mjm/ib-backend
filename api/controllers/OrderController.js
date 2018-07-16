module.exports = {

	add: (req, res) => {
		if(['customer', 'manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.token.role === 'customer') {
			req.body.customer_id = req.token.customerId
			delete req.body.status
		}
		OrderForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			OrderService.add(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	listPanel: (req, res) => {
		if(req.token.role === 'manager') {
			OrderService.listByManager({
					status: 	req.param('status', null),
					storeId: 	req.param('store_id', null),
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
			OrderService.listByStore({
					status: 	req.param('status', null),
					storeId: 	req.token.storeId,
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
}