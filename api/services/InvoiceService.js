const ModelHelper = require('../../helper/ModelHelper')
const _ = require('lodash')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

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
          latitude: attr.latitude || null,
          longitude: attr.longitude || null,
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
        if (err || model.length === 0) return resolve(100000000)
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

  calculateAndUpdate: (id, amount, orders) => {
    return new Promise((resolve, reject) =>
    {
      let shippingCost = 0
      let shippingType = null
      let shippingMethod = null

      if(orders.length === 1 && orders[0].count === 1) {
        if(orders[0].product.dimensions) {
          dimension = orders[0].product.dimensions.split('*')
          if(dimension[0] > 45 || dimension[1] > 45 || dimension[2] > 45) {
            shippingType = 'payment-at-place'
          }
        }

        if(orders[0].product.weight && orders[0].product.weight > 25) {
          shippingType = 'payment-at-place'
        }

        if(!orders[0].product.weight || !orders[0].product.dimensions) {
          shippingType = 'payment-at-place'
        }
      }
      else {
        shippingType = 'payment-at-place'
      }

      if(shippingType === 'payment-at-place') {
        shippingCost = 0
        shippingMethod = 'pickup-truck'
      }
      else if (amount > 100000) {
        shippingMethod = 'bike-delivery'
        shippingCost = 0
        shippingType = 'free'
      }
      else {
        shippingMethod = 'bike-delivery'
        shippingCost = 5000
        shippingType = 'online'
      }
      
      self.update(id, {amount, shippingCost, shippingType, shippingMethod}).then(resolve, reject)
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

  listByStore: (criteria, storeId, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT * FROM (SELECT i.id, i.createdAt FROM `invoice` `i` \
        INNER JOIN `order` `o` ON o.invoiceId = i.id \
          INNER JOIN `product` `p` ON p.id = o.productId AND p.storeId = ? \
          WHERE i.status != "pending" AND i.status != "rejected") i'

      let dataQuery = []
      let where = []

      dataQuery.push(storeId)

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
        o.id `[orders].id`, o.count `[orders].count`, o.price `[orders].price`, o.productId `[orders].product.id`, \
        p.nameFa `[orders].product.name.fa`, p.nameEn `[orders].product.name.en`, \
        o.status, o.reasonRejected \
      FROM ('+query+') i \
        INNER JOIN `order` `o` ON o.invoiceId = i.id \
          INNER JOIN `product` `p` ON p.id = o.productId AND p.storeId = ?'
      
      dataQuery.push(storeId)

      if(sort) {
        query += ` ORDER BY ${sort}`
      }

      Invoice.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        list = list.map(invoice => {
          let amount = 0
          invoice.orders.forEach(order => {
            amount += order.price * order.count
          })
          return {...invoice, amount}
        })
        resolve(list)
      })
    })
  },

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, number, amount, cityId, address, customerId, postalCode postal_code, latitude, longitude, phone, name, createdAt, status, reasonRejected FROM `invoice`'

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
        o.id `[orders].id`, o.status `[orders].status`, o.count `[orders].count`, o.price `[orders].price`, o.weight `[orders].weight`, o.productId `[orders].product.id`, op.nameFa `[orders].product.title.fa`, op.nameEn `[orders].product.title.en`, \
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
      let query = 'SELECT id, id `invoice.id`, number `invoice.number`, customerId, amount `invoice.total`, shippingCost `invoice.shipping_cost`, shippingType `invoice.shipping_type`, createdAt `invoice.created_at`, \
          createdAt `paking.created_at`, status `paking.status`, reasonRejected `paking.reason_rejected`, \
          cityId `receiver.city_id`, postalCode `receiver.postal_code`, address `receiver.address`, \
          latitude `receiver.latitude`, longitude `receiver.longitude`, phone `receiver.phone`, name `receiver.name` \
        FROM `invoice` \
        WHERE id = ? AND customerId = ?'

      query = 'SELECT i.*, \
        o.id `[orders].id`, o.status `[orders].status`, o.count `[orders].count`, o.price `[orders].price`, \
        o.productId `[orders].product.id`, op.nameFa `[orders].product.title.fa`, op.nameEn `[orders].product.title.en`, \
        op.price `[orders].product.price`, op.discount `[orders].product.discount`, \
        CONCAT("'+sails.config.params.staticUrl+'", oppf.path, oppf.name) `[orders].product.[image].path`, \
        op.storeId `[orders].product.store.id`, ops.nameFa `[orders].product.store.title.fa`, ops.nameEn `[orders].product.store.title.en`, \
        p.id `[payments].id`, p.amount `[payments].amount`, p.reffererCode `[payments].reffererCode`, p.statusCode `[payments].statusCode`, p.status `[payments].status`, p.status `[payments].status`, p.type `[payments].type`, p.createdAt `[payments].created_at` \
      FROM ('+query+') i \
        LEFT JOIN `customer` `c` ON c.id = i.customerId \
        LEFT JOIN `order` `o` ON o.invoiceId = i.id \
          LEFT JOIN `product` `op` ON op.id = o.productId \
          LEFT JOIN `store` `ops` ON ops.id = op.storeId \
            LEFT JOIN `product_photo` `opp` ON opp.productId = op.id \
              LEFT JOIN `file` `oppf` ON oppf.id = opp.fileId \
        LEFT JOIN `payment` `p` ON p.invoiceId = i.id'

      Invoice.query(query, [id, customerId], (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        item = ModelHelper.ORM(rows)[0]
        delete item.id
        delete item.customerId

        deliveryList = []
        item.orders = item.orders.map(order => {
          order.product.image = (order.product.image.length > 0) ? order.product.image[0].path : null
          order.product.store = {
            id: order.product.store.id,
            title: {
              fa: order.product.store['title.fa'],
              en: order.product.store['title.en'],
            }
          }
          deliveryList.push({
            ...order.product.store,
            status: order.status
          })
          return order
        })

        item.delivery = _.uniqBy(deliveryList, 'id')
        resolve(item)
      })
    })
  },

  infoByStore: (criteria, storeId) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, cityId, address, postalCode postal_code, latitude, longitude, phone, name, createdAt FROM `invoice`'

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
        o.id `[orders].id`, o.count `[orders].count`, o.price `[orders].price`, o.weight `[orders].weight`, o.productId `[orders].product.id`, \
        p.nameFa `[orders].product.name.fa`, p.nameEn `[orders].product.name.en`, \
        o.status, o.reasonRejected \
      FROM ('+query+') i \
        LEFT JOIN `city` ON city.id = i.cityId \
          LEFT JOIN `province` ON province.id = city.provinceId \
        INNER JOIN `order` `o` ON o.invoiceId = i.id \
          INNER JOIN `product` `p` ON p.id = o.productId AND p.storeId = ?'

      dataQuery.push(storeId)
      
      Invoice.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        item = ModelHelper.ORM(rows)[0]
        delete item.customerId
        delete item.cityId

        item.amount = 0
        item.orders.forEach(order => {
          item.amount += order.price * order.count
        })

        item.province     = sails.config.params.adminProvince
        item.city         = sails.config.params.adminCity
        item.address      = sails.config.params.adminAddress
        item.name         = sails.config.params.adminName
        item.phone        = sails.config.params.adminPhone
        item.postal_code  = sails.config.params.adminPostalCode
        item.latitude     = sails.config.params.adminLatitude
        item.longitude    = sails.config.params.adminLongitude

        resolve(item)
      })
    })
  },

  editByManager: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      self.update(id, attr).then(resolve, reject)
    })
  },

  editByStore: (id, storeId, attr) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.status !== undefined && attr.status === 'sent') {
        self.infoByStore({id}, storeId).then(invoice =>
        {
          for(let i=0; i<invoice.orders.length; i++)
          {
            OrderService.update(invoice.orders[i].id, {status: 'sent'}).then(() =>
            {
              if(i >= invoice.orders.length-1) {
                self.changeToSentStatus(id).then(() => {
                  resolve({messages: ['صورت‌حساب موردنظر به حالت ارسال شده تغییر وضعیت داده شد']})
                })
              }
            }, reject)
          }
        }, reject)
      }
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

  changeToSentStatus: (invoiceId) => {
    return new Promise((resolve, reject) =>
    {
      OrderService.find({invoiceId}).then(orders => {
        for(let i=0; i<orders.length; i++) {
          if(orders[i].status !== 'sent') {
            return resolve()
          }
        }

        self.update(invoiceId, {status: 'sent'}).then(resolve, reject)
      }, reject)
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
  },

  check: (id, customerId) => {
    return new Promise((resolve, reject) =>
    {
      Invoice.findOne({id, customerId}).exec((err, row) => {
        if(err || !row) return reject('صورت‌حساب مورد نظر یافت نشد.')
        if(row.status === 'paid') {
          return resolve({status: 'paid', messages: ['پرداخت با موفقیت انجام شد و صورت‌حساب در انتظار بررسی توسط فروشنده است.']})
        }
        else if(row.status === 'rejected') {
          return resolve({status: 'rejected', messages: [row.reasonRejected]})
        }
        return resolve({status: row.status})
      })
    })
  }
}

