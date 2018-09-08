module.exports = {

	send: (req, res) => {
		MessageForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			MessageService.add(req.body).then(result => {
				return res.json(200, result)
			}, (err) => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},
}

