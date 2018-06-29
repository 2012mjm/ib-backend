os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

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
          return reject('مشکلی پیش آمده است دوباره تلاش کنید.')
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
          reject('مشکلی پیش آمده است دوباره تلاش کنید.')
        }
      })
    })
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Store.findOne({mobile: attr.mobile}, function (err, store) {
        if (!store) {
          return reject('شماره موبایل یا کلمه عبور صحیح نمی باشد.')
        }

        Store.comparePassword(attr.password, store, function (err, valid) {
          if (err) {
            return reject('شماره موبایل یا کلمه عبور صحیح نمی باشد.')
          }

          if (!valid) {
            return reject('شماره موبایل یا کلمه عبور صحیح نمی باشد.')
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

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let model = Store.find().populate('logoId')
      Object.keys(criteria).forEach(key => {
        if(criteria[key] === null) delete criteria[key]
      })

      if(criteria)      model.where(criteria)
      if(sort)          model.sort(sort)
      if(count)         model.limit(count)
      if(count && page) model.skip((page-1)*count)

      model.exec((err, rows) => {
        if(err || rows.lenght === 0) return reject('موردی یافت نشد.')

        list = []
        rows.forEach(row => {
          list.push({
            id: row.id,
            mobile: row.mobile,
            email: row.email,
            title: {
              fa: row.nameFa,
              en: row.nameEn,
            },
            owner: {
              fa: row.ownerFa,
              en: row.ownerEn,
            },
            logo: (row.logoId) ? `${sails.config.params.apiUrl}${row.logoId.path}${row.logoId.name}` : null,
            createdAt: row.createdAt
          })
        })
        resolve(list)
      })
    })
  },

  listByManager: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort).then(resolve, reject)
    })
  },

  listAll: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort).then(rows => {
        rows.forEach((item, index) => {
          delete rows[index].mobile
          delete rows[index].password
          delete rows[index].email
        })
        resolve(rows)
      }, reject)
    })
  },
}
