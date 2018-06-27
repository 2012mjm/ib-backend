module.exports = {

	add: (req, res) => {
		if(req.token.role !== 'store') {
			return res.json(422, ErrorService.filter('شما دسترسی این عمل را ندارد.'))
		}
		req.body.store_id = req.token.storeId

		ProductForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			ProductService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	// list: (req, res) => {
	// 	ProductService.list().then(result => {
	// 		return res.json(200, result)
	// 	}, (err) => {
	// 		return res.json(422, ErrorService.filter(err))
	// 	})
	// },
}

