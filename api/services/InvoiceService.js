const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')
const md5 = require('md5')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Invoice.create({
        customerId: attr.customer_id,
        number: md5(Date.now()),
        cityId: attr.city_id || null,
        address: attr.address || null,
        postalCode: attr.postal_code || null,
        phone: attr.phone || null,
        status: attr.status || 'draft',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec((err, model) => {

        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }

        if (model) {
          resolve({messages: ['صورت‌حساب جدید با موفقیت ایجاد شد.'], invoice: model})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      Invoice.update(id, attr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['صورتحساب مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, number, amount, customerId customer_id, createdAt, status, reasonRejected \
        FROM `invoice`'

      let dataQuery = []
      let where = []

      Object.keys(criteria).forEach(key => {
        if(criteria[key] === null) return delete criteria[key]
        where.push(`${key} = ?`)
        dataQuery.push(criteria[key])
      })

      if(where.length > 0) {
        query += ` WHERE ${where.join(' AND ')}`
      }
      if(count) {
        query += ` LIMIT ?`
        dataQuery.push(parseInt(count, 10))
      }
      if(count && page) {
        query += ` OFFSET ?`
        dataQuery.push((page-1)*count)
      }

      query = 'SELECT i.*, \
        c.mobile `customer.mobile`, c.name `customer.name`, \
        o.id `orders.id`, o.quantity `orders.quantity`, o.price `orders.price`, o.productId `orders.product_id`, op.nameFa `orders.product_name_fa`, \
        p.id `payments.id`, p.amount `payments.amount`, p.trackingCode `payments.trackingCode`, p.reffererCode `payments.reffererCode`, p.statusCode `payments.statusCode`, p.status `payments.status`, p.type `payments.type`, p.createdAt `payments.createdAt` \
      FROM ('+query+') i \
        LEFT JOIN `customer` `c` ON c.id = i.customer_id \
        LEFT JOIN `order` `o` ON o.invoiceId = i.id \
          LEFT JOIN `product` `op` ON op.id = o.productId \
        LEFT JOIN `payment` `p` ON p.invoiceId = i.id'

      if(sort) {
        query += ` ORDER BY ?`
        dataQuery.push(sort)
      }
      
      Invoice.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
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

  listByCustomer: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort).then(rows => {
        rows.forEach((item, index) => {
          delete rows[index].customer_id
          delete rows[index].customer
        })
        resolve(rows)
      }, reject)
    })
  },
}

