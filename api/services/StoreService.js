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
        status: 'active',
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
            description: {
              fa: 'دیجی‌کالا مرجع تخصصی نقد و بررسی و فروش اینترنتی کالا در ایران است. گروه‏‏‌های مختلف کالا مانند کالای دیجیتال، لوازم خانگی، لوازم شخصی، فرهنگ و هنر و ورزش و سرگرمی با تنوعی بی‌نظیر در دیجی‌کالا عرضه می‏‏‏‌شوند...',
              en: null,
            },
            slogan: {
              fa: 'بررسی، انتخاب و خرید آنلاین',
              en: null,
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
          delete rows[index].email,
          delete rows[index].createdAt
        })
        resolve(rows)
      }, reject)
    })
  },

  findById: (id) => {
    return new Promise((resolve, reject) =>
    {
      Store.findOne({id}).exec((err, model) => {
        if (err || !model) return reject('فروشگاه مورد نظر یافت نشد.')
        resolve(model)
      })
    })
  },

  info: (attr) => {
    return new Promise((resolve, reject) =>
    {
      let model = Store.findOne(attr).populate('logoId')
      model.exec((err, row) => {
        if(err || !row) return reject('فروشگاه مورد نظر پیدا نشد.')
        resolve({
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
          description: {
            fa: row.descriptionFa,
            en: row.descriptionEn,
          },
          logo: (row.logoId) ? `${sails.config.params.apiUrl}${row.logoId.path}${row.logoId.name}` : null,
          createdAt: row.createdAt,
          status: row.status
        })
      })
    })
  },

  infoByManager: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id}).then(resolve, reject)
    })
  },

  infoByStore: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id}).then(resolve, reject)
    })
  },

  infoOne: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id, status: 'active'}).then(item => {
        delete item.status
        delete item.mobile
        delete item.email
        delete item.createdAt
        resolve(item)
      }, reject)
    })
  },

  edit: (id, attr, role) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.logo._files.length > 0) {
        FileService.addPhoto(attr.logo).then(res => {
          attr.logoId = res.id
          self.update(id, attr, role).then(resolve, reject)
        })
      }
      else {
        attr.logo.upload({noop: true})
        self.update(id, attr, role).then(resolve, reject)
      }
    })
  },

  update: (id, attr, role) => {
    return new Promise((resolve, reject) => {
      let newAttr = {}

      if(attr.mobile)         newAttr.mobile = attr.mobile
      if(attr.password)       newAttr.password = attr.password
      if(attr.email)          newAttr.email = attr.email
      if(attr.store_name_fa)  newAttr.nameFa = attr.store_name_fa
      if(attr.store_name_en)  newAttr.nameEn = attr.store_name_en
      if(attr.description_fa) newAttr.descriptionFa = attr.description_fa
      if(attr.description_en) newAttr.descriptionEn = attr.description_en
      if(attr.owner_fa)       newAttr.ownerFa = attr.owner_fa
      if(attr.owner_en)       newAttr.ownerEn = attr.owner_en
      if(attr.status)         newAttr.status = attr.status
      if(attr.logoId)         newAttr.logoId = attr.logoId

      Store.update(id, newAttr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['فروشگاه مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },

  delete: (id) => {
    return new Promise((resolve, reject) =>
    {
      Store.update(id, {status: 'deleted'}).exec((err, model) => {
        if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['فروشگاه مورد نظر با موفقیت به حالت حذف شده درآمد.']})
      })
    })
  },

  deleteForce: (id) => {
    return new Promise((resolve, reject) =>
    {
      Store.destroy({id}).exec(err => {
        if(err) return reject('مشکلی پیش آمده است.')
        resolve({messages: ['فروشگاه مورد نظر با موفقیت حذف شد.']})
      })
    })
  },
}
