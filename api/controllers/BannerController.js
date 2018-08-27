module.exports = {

	add: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
		req.body.image = req.file('image')

		BannerCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			BannerService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	list: (req, res) => {
		BannerService.list().then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	info: (req, res) => {
		BannerService.info(req.param('id', null)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	edit: (req, res) => {
		if(req.token.role !== 'manager') {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}
		req.body.image = req.file('image')

		BannerUpdateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			BannerService.edit(parseInt(req.body.id, 10), req.body).then(result => {
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

		BannerService.delete(parseInt(req.param('id'), 10)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}

