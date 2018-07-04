module.exports = {

	signup: (req, res) => {
		ManagerSignupForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			ManagerService.signup(req.body).then((result) => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},

  login: (req, res) => {
    req.body.remember_me  = (req.body.remember_me == '0') ? false : true

    ManagerLoginForm.validate(req.body, (err) => {
      if (err) return res.json(422, ErrorService.filter(err))

      ManagerService.login(req.body).then((result) => {
        return res.json(200, result)
      }, (err) => {
        return res.json(401, ErrorService.filter(err))
      })
    })
  },

}

