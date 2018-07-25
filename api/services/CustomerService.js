const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  signup: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.create({
        mobile: attr.mobile,
        isVerifiedMobile: 0,
        mobileKey: Math.floor(Math.random() * 9999) + 1000,
        expiryMobileKey: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss'),
        status: 'inactive',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, model) {
        if (err || !model) return reject('مشکلی پیش آمده است دوباره تلاش کنید.')

        SmsService.send(model.mobile, `کد فعال سازی حساب کاربری ایرانی بخریم: ${model.mobileKey}`).then(() => {
          resolve({messages: ['کد تایید برای شما ارسال شد.'], id: model.id, is_new: true})
        }, err => {
          console.log('signup -> SmsService', err)
          reject('مشکلی پیش آمده است با پشتیبانی تماس حاصل فرمایید.')
        })
      })
    })
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.findOne({mobile: attr.mobile}, function (err, model) {
        if (!model) {
          return self.signup(attr).then(resolve, reject)
        }

        if(model.status === 'banned') {
          return reject('حساب کاربری شما مسدود شده است.')
        }

        self.createVerifyCodeAndSend(model.id).then(msg => {
          resolve({messages: [msg], id: model.id, is_new: false})
        }, reject)
      })
    })
  },

  verifyCode: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.findOne({id: attr.id}, function (err, model) {
        if (err || model === undefined) {
          return reject('اطلاعات ارسالی شما صحیح نمی‌باشد، دوباره تلاش کنید.')
        }

        if(model.status === 'banned') {
          return reject('حساب کاربری شما مسدود شده است.')
        }

        if(moment() > moment(model.expiryMobileKey)) {
          self.createVerifyCodeAndSend(model.id).then(msg => {
            return reject('مدت زمان کد تایید به پایان رسیده است، کد تایید جدید برای شما ارسال شد.')
          }, err => {
            return reject(err)
          })
        }
        else {
          if(model.mobileKey === '' || model.mobileKey === null) {
            return reject('مشکلی پیش آمده است دوباره تلاش کنید.')
          }

          if(parseInt(attr.code, 10) !== parseInt(model.mobileKey, 10)) {
            return reject('کد تایید صحیح نمی‌باشد.')
          }

          Customer.update({id: model.id}, {
            mobileKey: null,
            expiryMobileKey: null,
            isVerifiedMobile: 1,
            status: 'active'
          }).exec((err, newModels) => {
            self.info({id: model.id}).then(res => {
              resolve({
                ...res,
                token: JwtService.issue({ customerId: model.id, role: 'customer', isAdmin: false }, true)
              })
            }, reject)
          })
        }
      })
    })
  },

  createVerifyCodeAndSend: (id) => {
    return new Promise((resolve, reject) =>
    {
      Customer.update({id}, {
        mobileKey: Math.floor(Math.random() * 9999) + 1000,
        expiryMobileKey: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')
      }).exec((err, newModels) => {
        SmsService.send(newModels[0].mobile, `کد فعال سازی حساب کاربری ایرانی بخریم: ${newModels[0].mobileKey}`).then(() => {
          resolve('کد تایید برای شما ارسال شد.')
        }, err => {
          console.log('createVerifyCodeAndSend -> SmsService', err)
          reject('مشکلی پیش آمده است با پشتیبانی تماس حاصل فرمایید.')
        })
      })
    })
  },

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.create({
        mobile: attr.mobile,
        name: attr.name || null,
        phone: attr.phone || null,
        postalCode: attr.postal_code || null,
        address: attr.address || null,
        cityId: attr.city_id || null,
        isVerifiedMobile: 0,
        status: attr.status || 'active',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, model) {
        if (err) {
          return reject('مشکلی پیش آمده است دوباره تلاش کنید.')
        }

        if (model) {
          resolve({messages: ['حساب کاربری مشتری جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('مشکلی پیش آمده است دوباره تلاش کنید.')
        }
      })
    })
  },

  edit: (id, attr) => {
    return new Promise((resolve, reject) => {
      let newAttr = {}

      if(attr.name)           newAttr.name = attr.name
      if(attr.phone)          newAttr.phone = attr.phone
      if(attr.postal_code)    newAttr.postalCode = attr.postal_code
      if(attr.address)        newAttr.address = attr.address
      if(attr.city_id)        newAttr.cityId = attr.city_id
      if(attr.addresses)      newAttr.addresses = attr.addresses
      if(attr.status)         newAttr.status = attr.status

      Customer.update(id, newAttr).exec((err, model) => {
        if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['ویرایش اطلاعات با موفقیت انجام شد.']})
      })
    })
  },

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let model = Customer.find()
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
            name: row.name,
            phone: row.phone,
            address: row.address,
            addresses: row.addresses,
            city_id: row.cityId,
            postal_code: row.postalCode,
            is_verified_mobile: row.isVerifiedMobile,
            status: row.status,
            created_at: row.createdAt
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

  isUniqueMobile: (mobile) => {
    return new Promise((resolve, reject) =>
    {
      Customer.findOne({mobile}, (err, model) => {
        if (err || !model) return reject()
        resolve()
      })
    })
  },

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, name, mobile, addresses, isVerifiedMobile is_verified_mobile, createdAt created_at FROM `customer`'

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

      query = 'SELECT c.*, \
        SUM(IF(i.status = "pending", 1, 0)) `previous_purchase.pending`, \
        SUM(IF(i.status = "paid", 1, 0)) `previous_purchase.paid`, \
        SUM(IF(i.status = "sent", 1, 0)) `previous_purchase.sent`, \
        SUM(IF(i.status = "rejected", 1, 0)) `previous_purchase.rejected` \
        FROM ('+query+') c \
        LEFT JOIN `invoice` `i` ON i.customerId = c.id'

      Customer.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        item = ModelHelper.ORM(rows)[0]
        item.following = 8
        item.image = null
        item.is_verified_mobile = (item.is_verified_mobile === 1) ? true : false
        resolve(item)
      })
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.update(id, attr).exec((err, model) => {
        if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['اطلاعات مشتری مورد نظر با موفقیت ویرایش شد.'], invoice: model[0]})
      })
    })
  },

  expiryMobileVerifyCron: () => {
    return new Promise((resolve, reject) =>
    {
      Customer.find().where({expiryMobileKey: {'<':moment().format('YYYY-MM-DD HH:mm:ss')}}).exec((err, rows) => {
        if(err || !rows) return reject(err)
        rows.forEach(row => {
          self.update(row.id, {mobileKey: null, expiryMobileKey: null}).then(()=>{},()=>{})
        })
        resolve(rows)
      })
    })
  }
}
