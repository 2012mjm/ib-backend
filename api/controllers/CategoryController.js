module.exports = {

	add: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
		req.body.photo = req.file('photo')

		CategoryCreateForm.validate(req.body, (err) => {
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

	edit: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
		req.body.photo = req.file('photo')

		CategoryUpdateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CategoryService.edit(parseInt(req.body.id, 10), req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	delete: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		CategoryService.delete(parseInt(req.body.id, 10)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}

