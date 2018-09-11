const TextHelper = require('../../helper/TextHelper')
const ModelHelper = require('../../helper/ModelHelper')

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
        sloganFa: attr.slogan_fa || null,
        sloganEn: attr.slogan_en || null,
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
            slogan: {
              fa: row.sloganFa,
              en: row.sloganEn,
            },
            description: {
              fa: TextHelper.ellipse(row.descriptionFa, 200),
              en: TextHelper.ellipse(row.descriptionEn, 200),
            },
            logo: (row.logoId) ? `${sails.config.params.staticUrl}${row.logoId.path}${row.logoId.name}` : null,
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

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, mobile, email, \
        nameFa `title.fa`, nameEn `title.en`, \
        ownerFa `owner.fa`, ownerEn `owner.en`, \
        sloganFa `slogan.fa`, sloganEn `slogan.en`, \
        descriptionFa `description.fa`, descriptionEn `description.en`, \
        createdAt, status, logoId \
        FROM `store`'

      let dataQuery = []
      let where = []

      Object.keys(criteria).forEach(key => {
        if(criteria[key] === null) return delete criteria[key]

        let opt = '='
        if(typeof criteria[key] === 'object') {
          opt = Object.keys(criteria[key])[0]
          criteria[key] = criteria[key][Object.keys(criteria[key])[0]]
        }
        where.push(`${key} ${opt} ?`)
        dataQuery.push(criteria[key])
      })

      if(where.length > 0) {
        query += ` WHERE ${where.join(' AND ')}`
      }

      query = 'SELECT s.*, \
        CONCAT("'+sails.config.params.staticUrl+'", f.path, f.name) logo, \
        CEIL(AVG(p.star)) rate, COUNT(p.id) product_count \
        FROM ('+query+') s \
        LEFT JOIN `file` `f` ON f.id = s.logoId \
        LEFT JOIN `product` `p` ON p.storeId = s.id'

      Store.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        list[0].followers = 12
        delete list[0].logoId
        resolve(list[0])
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
      if(attr.slogan_fa)      newAttr.sloganFa = attr.slogan_fa
      if(attr.slogan_en)      newAttr.sloganEn = attr.slogan_en
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

  // checkout with store each 72 hours or 3 days
  checkoutCron: () => {
    return new Promise((resolve, reject) =>
    {
      query = 'SELECT i.id, i.amount, i.number, i.status, \
          o.storeId `[orders].storeId`, o.price `[orders].price`, o.count `[orders].count` \
        FROM `invoice` i \
          INNER JOIN `payment` p ON p.invoiceId = i.id AND p.statusCode = ? AND p.createdAt < ? \
          LEFT JOIN `order` o ON o.invoiceId = i.id AND o.status = ? \
        WHERE i.status != ?'

      Invoice.query(query, [100, moment().subtract(3, 'day').format('YYYY-MM-DD HH:mm:ss'), 'sent', 'checkout'], (err, rows) => {
        if (err || rows.length === 0) return reject('not found')

        const invoices = ModelHelper.ORM(rows)

        for(let i=0; i<invoices.length; i++) {
          const invoice = invoices[i]

          invoice.orders.forEach(order => {
            amount = order.price * order.count * (100 - sails.config.params.commissionSystemSales) / 100
            self.increaseCredit(order.storeId, amount).then().catch()
          })
          
          InvoiceService.update(invoice.id, {status: 'checkout'}).then().catch()
        }

        resolve(invoices)
      })
    })
  },

  increaseCredit: (id, amount) => {
    return new Promise((resolve, reject) =>
    {
      Product.query('UPDATE `store` SET `credit` = `credit` + ? WHERE `id` = ?', [amount, id], (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      })
    })
  },

  decreaseCredit: (id, amount) => {
    return new Promise((resolve, reject) =>
    {
      Product.query('UPDATE `store` SET `credit` = `credit` - ? WHERE `id` = ?', [amount, id], (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      })
    })
  },

  checkCredit: (id, amount) => {
    return new Promise((resolve, reject) =>
    {
      self.findById(id).then(store => {
        if(amount > store.credit) return reject(`موجودی کافی نیست، موجودی فعلی شما: ${store.credit} تومان می‌باشد`)
        resolve(store.credit)
      }, err => {
        reject('فروشنده‌ای با این مشخصات یافت نشد.')
      })
    })
  }
}
