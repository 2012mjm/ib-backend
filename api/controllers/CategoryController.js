module.exports = {

	add: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی این عمل را ندارد.'))
		}
		req.body.photo = req.file('photo')

		CategoryForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CategoryService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	list: (req, res) => {
		CategoryService.list().then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}

