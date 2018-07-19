module.exports = {

	list: (req, res) => {
		CityService.list().then(result => {
			return res.json(200, result)
		}, (err) => {
			return res.json(422, ErrorService.filter(err))
		})
	},
}