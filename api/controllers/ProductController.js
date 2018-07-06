module.exports = {

	add: (req, res) => {
		if(['manager', 'store'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.token.role === 'store') {
			req.body.store_id = req.token.storeId
			delete req.body.status
		}

		ProductCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			ProductService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	addPhoto: (req, res) => {
		if(['manager', 'store'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		req.body.photo = req.file('photo')

		if(req.token.role === 'store') {
			req.body.store_id = req.token.storeId
		}

		ProductPhotoForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			ProductService.addPhoto(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	listPanel: (req, res) => {
		if(req.token.role === 'manager') {
			ProductService.listByManager({
					status: 	req.param('status', null),
					storeId: 	req.param('store_id', null),
					categoryId: req.param('category_id', null),
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
			ProductService.listByStore({
					status: 	req.param('status', null),
					storeId: 	req.token.storeId,
					categoryId: req.param('category_id', null),
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

	list: (req, res) => {
		ProductService.listAll({
				status: 'accepted',
				storeId: 	req.param('store_id', null),
				categoryId: req.param('category_id', null),
			},
			req.param('page', 1),
			req.param('count', 10),
			req.param('sort', 'createdAt DESC')
		).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	infoPanel: (req, res) => {
		if(req.token.role === 'manager') {
			ProductService.infoByManager(req.param('id', null)).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else if(req.token.role === 'store') {
			ProductService.infoByStore(req.param('id', null), req.token.storeId).then(result => {
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
		ProductService.infoOne(req.param('id', null)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	edit: (req, res) => {
		if(['manager', 'store'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.token.role === 'store') {
			req.body.store_id 	= req.token.storeId
			req.body.status 	= 'pending'
		}

		ProductUpdateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			ProductService.edit(parseInt(req.body.id, 10), req.body, req.token.role).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},
}

