os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Product.create(Object.assign(attr, {
        sub: attr.mobile,
        password: attr.password,
        email: attr.email,
        name: attr.store_name,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      })).exec(function (err, store) {
        if (err) {
          return reject(err)
        }

        if (store) {
          resolve({
            id: store.id,
            mobile: store.mobile,
            email: store.email,
            store_name: store.name,
            store_owner: store.owner,
            token: JwtService.issue({ storeId: store.id, type: 'store', isAdmin: false }, true)
          })
        } else {
          reject(sails.__('Error in signup'))
        }
      })
    })
  },
}
