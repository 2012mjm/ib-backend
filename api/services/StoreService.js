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
        nameFa: attr.store_name_fa,
        nameEn: attr.store_name_en || null,
        ownerFa: attr.owner_fa || null,
        ownerEn: attr.owner_en || null,
        descriptionFa: attr.description_fa || null,
        descriptionEn: attr.description_en || null,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, store) {
        if (err) {
          return reject(err)
        }

        if (store) {
          resolve({
            id: store.id,
            mobile: store.mobile,
            email: store.email,
            store_name_fa: store.nameFa,
            store_name_en: store.nameEn,
            store_owner_fa: store.ownerFa,
            store_owner_en: store.ownerEn,
            token: JwtService.issue({ storeId: store.id, role: 'store', isAdmin: false }, true)
          })
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
              store_name_fa: store.nameFa,
              store_name_en: store.nameEn,
              store_owner_fa: store.ownerFa,
              store_owner_en: store.ownerEn,
              token: JwtService.issue({ storeId: store.id, role: 'store', isAdmin: false }, true)
            })
          }
        })
      })
    })
  },


}
