os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

module.exports = {

  signup: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Store.create({
        mobile: attr.mobile,
        password: attr.password,
        email: attr.email,
        name: attr.store_name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, store) {
        if (err) {
          return reject(err)
        }

        if (store) {
          resolve({token: JwtService.issue({ id: store.id })})
        } else {
          reject(sails.__('Error in signup'))
        }
      })
    })
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Store.findOne({mobile: attr.mobile}, function (err, store) {
        if (!store) {
          return reject('invalid mobile or password')
        }

        Store.comparePassword(attr.password, store, function (err, valid) {
          if (err) {
            return reject('forbidden')
          }

          if (!valid) {
            return reject('invalid mobile or password')
          } else {
            resolve({
              id: store.id,
              mobile: store.mobile,
              email: store.email,
              store_name: store.name,
              token: JwtService.issue({ id: store.id, isAdmin: false }, true)
            })
          }
        })
      })
    })
  },


}
