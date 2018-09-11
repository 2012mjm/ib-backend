module.exports = {

	add: (req, res) => {
		if(['manager', 'store'].indexOf(req.token.role) === -1) {
			return res.json(422, ErrorService.filter('شما دسترسی انجام این عمل را ندارید.'))
		}

		if(req.token.role === 'store') {
			req.body.store_id = req.token.storeId
			delete req.body.status
		}

		WithdrawCreateForm.validate(req.body, (err) => {
			if (err) return res.json(422, ErrorService.filter(err))

			StoreService.checkCredit(req.body.store_id, req.body.amount).then(credit => {
				WithdrawService.add(req.body).then(result => {
					StoreService.decreaseCredit(req.body.store_id, req.body.amount).then(store =>
					{
						return res.json(200, result)
					}, err => {
						return res.json(422, ErrorService.filter(err))
					})
				}, (err) => {
					return res.json(422, ErrorService.filter(err))
				})
			}, err => {
				return res.json(422, ErrorService.filter(err))
			})
		})
	},
}

