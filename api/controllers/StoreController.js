module.exports = {

	signup: (req, res) => {
		StoreSignupForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			StoreService.signup(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

  login: (req, res) => {
    StoreLoginForm.validate(req.body, (err) => {
      if (err) return res.json(422, ErrorService.filter(err))

      StoreService.login(req.body).then((result) => {
        return res.json(200, result)
      }, (err) => {
        return res.json(401, ErrorService.filter(err))
      })
    })
  },

	listPanel: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
    }

    StoreService.listByManager({},
      req.param('page', 1),
      req.param('count', 10),
      req.param('sort', 'createdAt DESC')
    ).then(result => {
      return res.json(200, result)
    }, (err) => {
      return res.json(422, ErrorService.filter(err))
    })
	},

	list: (req, res) => {
    StoreService.listAll({
				status: 'active'
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
			StoreService.infoByManager(req.param('id', null)).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		}
		else if(req.token.role === 'store') {
			StoreService.infoByStore(req.token.storeId).then(result => {
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
		StoreService.infoOne(req.param('id', null)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	edit: (req, res) => {
		if(['manager', 'store'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		req.body.logo = req.file('logo')
		if(req.token.role === 'store') {
			req.body.id = req.token.storeId
			delete req.body.status
		}

		StoreForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			StoreService.edit(parseInt(req.body.id, 10), req.body, req.token.role).then(result => {
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

		StoreService.delete(parseInt(req.param('id'), 10)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},

	deleteForce: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		StoreService.deleteForce(parseInt(req.param('id'), 10)).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}

