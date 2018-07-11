module.exports = {

	add: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		AttributeCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			AttributeService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	addValue: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		req.body.image = req.file('image')

		AttributeValueCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			AttributeService.addValue(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	list: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		AttributeService.list({
			},
			req.param('page', 1),
			req.param('count', 10),
			req.param('sort', 'id DESC')
		).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	info: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
		
		AttributeService.info({id: req.param('id', null)}).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	edit: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		AttributeUpdateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			AttributeService.update(parseInt(req.body.id, 10), req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	delete: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		AttributeService.delete(parseInt(req.param('id'), 10)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}

