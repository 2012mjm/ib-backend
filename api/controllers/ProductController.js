module.exports = {

	add: (req, res) => {
    req.body.storeId = req.token.storeId
		ProductForm.validate(req.body, (err) => {
      console.log(ProductForm.storeId)
			if (err) return res.json(422, ErrorService.filter(err))
      console.log(ProductForm)
			// ProductService.add(req.body).then((result) => {
			// 	return res.json(200, result)
			// }, (err) => {
			// 	return res.json(422, ErrorService.filter(err))
			// })
		})
	},
}

