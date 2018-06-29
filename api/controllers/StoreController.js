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
    StoreService.listAll({},
      req.param('page', 1),
      req.param('count', 10),
      req.param('sort', 'createdAt DESC')
    ).then(result => {
      return res.json(200, result)
    }, (err) => {
      return res.json(422, ErrorService.filter(err))
    })
  }
}

