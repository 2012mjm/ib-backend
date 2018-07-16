module.exports = {

	login: (req, res) => {
		CustomerLoginForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CustomerService.login(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
  },
  
  verifyCode: (req, res) => {
		CustomerVerifyCodeForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CustomerService.verifyCode(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
  },

	add: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
    }

		CustomerCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CustomerService.add(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	edit: (req, res) => {
		if(['manager', 'customer'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
    }

		if(req.token.role === 'customer') {
			req.body.id = req.token.customerId
			delete req.body.status
		}

		CustomerUpdateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CustomerService.edit(req.body.id, req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

	info: (req, res) => {
		if(['customer', 'manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		let customerId = parseInt(req.param('id'), 10)
		if(req.token.role === 'customer') {
			customerId 	= req.token.customerId
		}
		
		CustomerService.info(customerId).then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
  },

	listPanel: (req, res) => {
		if(['manager'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
    }

    CustomerService.listByManager({},
      req.param('page', 1),
      req.param('count', 10),
      req.param('sort', 'createdAt DESC')
    ).then(result => {
      return res.json(200, result)
    }, (err) => {
      return res.json(422, ErrorService.filter(err))
    })
	},
}

