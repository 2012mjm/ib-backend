const axios = require('axios')

const self = module.exports = {
    send: (mobile, message) => {
        return new Promise((resolve, reject) =>
        {
            axios.post(`${sails.config.params['smsUrl']}SendSMS/SendSMS`, {
                username: sails.config.params['smsUsername'],
                password: sails.config.params['smsPassword'],
                from: sails.config.params['smsNumber'],
                to: mobile,
                text: message
            })
            .then(res => {
                if(res.data.RetStatus !== undefined && res.data.RetStatus === 1) return resolve(res.data)
                reject(res.data)
            }, err => {
                reject(err.response)
            })
        })
    }
}