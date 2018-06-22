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

}

