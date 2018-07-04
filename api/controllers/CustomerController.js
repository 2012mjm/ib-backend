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

		CustomerForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			CustomerService.add(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
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

