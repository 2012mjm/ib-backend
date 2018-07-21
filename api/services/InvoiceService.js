const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')
const md5 = require('md5')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      self.generateNumber().then(number => {
        Invoice.create({
          customerId: attr.customer_id,
          number: number,
          cityId: attr.city_id || null,
          address: attr.address || null,
          postalCode: attr.postal_code || null,
          phone: attr.phone || null,
          name: attr.name || null,
          status: attr.status || 'pending',
          amount: 0,
          createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
        }).exec((err, model) => {
          if (err || !model) return reject(err)
          resolve(model)
        })
      })
    })
  },

  generateNumber: () => {
    return new Promise((resolve, reject) =>
    {
      Invoice.find().sort('number DESC').limit(1).exec((err, model) => {
        if (err || !model) return resolve(100000000)
        resolve(parseInt(model[0].number, 10) + 1)
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
        resolve({messages: ['صورتحساب مورد نظر با موفقیت ویرایش شد.'], invoice: model[0]})
      })
    })
  },

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, number, amount, customerId, createdAt, status, reasonRejected \
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
        c.id `customer.id`, c.mobile `customer.mobile`, c.name `customer.name`, \
        o.id `[orders].id`, o.count `[orders].count`, o.price `[orders].price`, o.productId `[orders].product.id`, op.nameFa `[orders].product.name.fa`, op.nameEn `[orders].product.name.en`, \
        p.id `[payments].id`, p.amount `[payments].amount`, p.trackingCode `[payments].trackingCode`, p.reffererCode `[payments].reffererCode`, p.statusCode `[payments].statusCode`, p.status `[payments].status`, p.type `[payments].type`, p.createdAt `[payments].createdAt` \
      FROM ('+query+') i \
        LEFT JOIN `customer` `c` ON c.id = i.customerId \
        LEFT JOIN `order` `o` ON o.invoiceId = i.id \
          LEFT JOIN `product` `op` ON op.id = o.productId \
        LEFT JOIN `payment` `p` ON p.invoiceId = i.id'

      if(sort) {
        query += ` ORDER BY ${sort}`
      }
      
      Invoice.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)

        finalList = []
        list.forEach(item => {
          delete item.customerId
          finalList.push(item)
        })
        resolve(finalList)
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

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, number, amount, cityId, address, customerId, postalCode postal_code, phone, name, createdAt, status, reasonRejected FROM `invoice`'

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

      query = 'SELECT i.*, \
        province.id `province.id`, province.name `province.name`, city.id `city.id`, city.name `city.name`, \
        c.id `customer.id`, c.mobile `customer.mobile`, c.name `customer.name`, \
        o.id `[orders].id`, o.count `[orders].count`, o.price `[orders].price`, o.weight `[orders].weight`, o.productId `[orders].product.id`, op.nameFa `[orders].product.title.fa`, op.nameEn `[orders].product.title.en`, \
        p.id `[payments].id`, p.amount `[payments].amount`, p.trackingCode `[payments].trackingCode`, p.reffererCode `[payments].reffererCode`, p.statusCode `[payments].statusCode`, p.status `[payments].status`, p.reffererCode `[payments].reffererCode`, p.statusCode `[payments].statusCode`, p.status `[payments].status`, p.type `[payments].type`, p.createdAt `[payments].createdAt` \
      FROM ('+query+') i \
        LEFT JOIN `city` ON city.id = i.cityId \
          LEFT JOIN `province` ON province.id = city.provinceId \
        LEFT JOIN `customer` `c` ON c.id = i.customerId \
        LEFT JOIN `order` `o` ON o.invoiceId = i.id \
          LEFT JOIN `product` `op` ON op.id = o.productId \
        LEFT JOIN `payment` `p` ON p.invoiceId = i.id'
      
      Invoice.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        item = ModelHelper.ORM(rows)[0]
        delete item.customerId
        delete item.cityId
        resolve(item)
      })
    })
  },

  infoByManager: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id}).then(resolve, reject)
    })
  },

  infoByCustomer: (id, customerId) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id, customerId}).then(rows => {
        rows.forEach((item, index) => {
          delete rows[index].customer
        })
        resolve(rows)
      }, reject)
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      Invoice.update(id, attr).exec((err, model) => {
        if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['صورت‌حساب مورد نظر با موفقیت ویرایش شد.'], invoice: model[0]})
      })
    })
  },

  expiryCron: () => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT i.id, i.createdAt, i.status, \
        o.id `[orders].id`, o.count `[orders].count`, \
        p.id `[orders].product.id`, p.quantity `[orders].product.quantity` \
        FROM `invoice` i \
        LEFT JOIN `order` o ON o.invoiceId = i.id \
          LEFT JOIN `product` p ON p.id = o.productId \
        WHERE TIMESTAMPDIFF(MINUTE, i.createdAt, ?) > ? AND i.status = ?'

      Invoice.query(query, [moment().format('YYYY-MM-DD HH:mm:ss'), 25, 'pending'], (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        list.forEach(invoice => {
          // increate quantitiy product
          invoice.orders.forEach(order => {
            ProductService.increaseQuantity(order.product.id, order.count).then(()=>{},()=>{})
          })
          // update invoice with rejected status
          self.update(invoice.id, {
            status: 'rejected',
            reasonRejected: 'توسط سیستم منقضی شده است.'
          }).then(()=>{},()=>{})
        })
        resolve(list)
      })
    })
  }
}

