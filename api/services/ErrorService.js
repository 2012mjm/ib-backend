module.exports = {

	filter: (err) => {
		if(err.invalidAttributes) {
			let output = {}
			let messages = null
			if(err.model) {
				let model = sails.models[err.model.toLowerCase()]
				messages = model.validationMessages
			}
			let errValid = err.invalidAttributes

			for (attr in errValid) {
				output[attr] = new Array()
				errValid[attr].forEach((item) => {
					if(messages && messages.hasOwnProperty(attr) && messages[attr].hasOwnProperty(item.rule) && messages[attr][item.rule]) {
						output[attr].push(messages[attr][item.rule])
					} else {
						output[attr].push(item.message)
					}
				})
			}
			return {errors: output}
		}
		else if(err.originalError && err.originalError.code === 'E_FK') {
			let output = {}
			const error = err.originalError.invalidAttributes
			for (attr in err.originalError.invalidAttributes) {
				output[attr] = error[attr].map(item => { return item.value })
			}
			return {errors: output}
		}

		if(_.isArray(err)) {
			return {_errors: err}
		} else {
			return {_errors: [err]}
		}
	}
}
