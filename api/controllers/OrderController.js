module.exports = {

	add: (req, res) => {
		if(['customer', 'manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.body.products) {
			req.body.products = JSON.parse(req.body.products)
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
}