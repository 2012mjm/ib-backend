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

        Customer.update({id: model.id}, {
          mobileKey: Math.floor(Math.random() * 9999) + 1000,
          expiryMobileKey: moment().add(5, 'minutes').format('YYYY-MM-DD HH:mm:ss')
        }).exec((err, newModels) => {
          SmsService.send(newModels[0].mobile, `کد فعال سازی حساب کاربری ایرانی بخریم: ${newModels[0].mobileKey}`).then(() => {
            resolve({messages: ['کد تایید برای شما ارسال شد.'], id: model.id, is_new: false})
          }, err => {
            reject('مشکلی پیش آمده است با پشتیبانی تماس حاصل فرمایید.')
          })
        })
      })
    })
  },

  verifyCode: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Customer.findOne({id: attr.id}, function (err, model) {
        if (err || !model) {
          reject('اطلاعات ارسالی شما صحیح نمی‌باشد، دوباره تلاش کنید.')
        }

        if(model.status === 'banned') {
          return reject('حساب کاربری شما مسدود شده است.')
        }

        if(moment() > moment(model.expiryMobileKey)) {
          return reject('مدت زمان کد تایید به پایان رسیده است، کد تایید جدید برای شما ارسال شد.')
        }

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
          resolve({
            id: model.id,
            name: model.name,
            phone: model.phone,
            postalCode: model.postalCode,
            address: model.address,
            phone: model.phone,
            city_id: model.cityId,
            token: JwtService.issue({ customerId: model.id, role: 'customer', isAdmin: false }, true)
          })
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
        if (err || !model) {
          console.log('rejected')
          return reject()
        }
        resolve()
      })
    })
  }
}
