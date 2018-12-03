const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Product.create({
        storeId: attr.store_id,
        categoryId: attr.category_id,
        nameFa: attr.name_fa,
        nameEn: attr.name_en || null,
        descriptionFa: attr.description_fa || null,
        descriptionEn: attr.description_en || null,
        price: attr.price,
        discount: attr.discount || null,
        quantity: attr.quantity || 0,
        weight: attr.weight || null,
        dimensions: attr.dimensions || null,
        status: attr.status || 'pending',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec((err, model) => {

        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }

        if (model) {
          resolve({messages: ['محصول جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },

  list: (criteria, page, count, sort, search, filter) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, storeId, categoryId, price, discount, (price - IF(discount IS NOT NULL, discount, 0)) `price_final`, quantity, star rate, visit, sale, status, reasonRejected, createdAt, updatedAt, \
        nameFa `title.fa`, nameEn `title.en` \
        FROM `product`'

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

      if(filter.price.from) {
        where.push('(price - IF(discount IS NOT NULL, discount, 0)) >= ?')
        dataQuery.push(filter.price.from)
      }

      if(filter.price.to) {
        where.push('(price - IF(discount IS NOT NULL, discount, 0)) <= ?')
        dataQuery.push(filter.price.to)
      }

      if(search) {
        where.push('(nameFa LIKE ? OR nameEn LIKE ? OR descriptionFa LIKE ? OR descriptionEn LIKE ?)')
        for(let i=1; i<=4; i++) dataQuery.push(`%${search}%`)
      }
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

      query = 'SELECT p.*, \
        ph.id `[images].id`, phf.path `[images].path`, phf.name `[images].name`, \
        c.id `category.id`, c.nameFa `category.title.fa`, c.nameEn `category.title.en`, \
        s.id `store.id`, s.nameFa `store.title.fa`, s.nameEn `store.title.en` \
      FROM ('+query+') p \
        LEFT JOIN `product_photo` `ph` ON ph.productId = p.id \
          LEFT JOIN `file` `phf` ON phf.id = ph.fileId \
        LEFT JOIN `category` `c` ON c.id = p.categoryId \
        LEFT JOIN `store` `s` ON s.id = p.storeId'

      if(sort) {
        switch(sort) {
          case 'oldest':
            order = 'p.createdAt ASC'
            break
          case 'most_visited':
            order = 'p.visit DESC'
            break
          case 'lowest_visited':
            order = 'p.visit ASC'
            break
          case 'bestselling':
            order = 'p.sale DESC'
            break
          case 'most_expensive':
            order = 'p.price_final DESC'
            break
          case 'cheapest':
            order = 'p.price_final ASC'
            break
          case 'newest': default:
            order = 'p.createdAt DESC'
            break
        }
        query += ` ORDER BY ${order}`
      }

      Product.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)

        finalList = []
        list.forEach(item => {
          item.image = (item.images.length > 0) ? item.images[0] : []
          delete item.images
          delete item.storeId
          delete item.categoryId
          finalList.push(item)
        })
        resolve(finalList)
      })
    })
  },

  listByManager: (criteria, page, count, sort, search, filter) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort, search, filter).then(rows => 
        resolve(rows.map(item => ({...item,
          image: (item.image.length !== 0) ? {
            id: item.image.id,
            name: item.image.name,
            path: `${sails.config.params.staticUrl}${item.image.path}${item.image.name}`
          } : null
        })))
      , reject)
    })
  },

  listByStore: (criteria, page, count, sort, search, filter) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort, search, filter).then(rows => 
        resolve(rows.map(item => ({...item,
          image: (item.image.length !== 0) ? {
            id: item.image.id,
            name: item.image.name,
            path: `${sails.config.params.staticUrl}${item.image.path}${item.image.name}`
          } : null
        })))
      , reject)
    })
  },

  listAll: (criteria, page, count, sort, search, filter) => {
    return new Promise((resolve, reject) =>
    {
      self.list(criteria, page, count, sort, search, filter).then(rows => {
        rows.forEach((item, index) => {
          delete rows[index].status
          delete rows[index].reasonRejected
          delete rows[index].createdAt
          delete rows[index].updatedAt
          delete rows[index].category
          rows[index].image = (item.image.length !== 0) ? `${sails.config.params.staticUrl}${rows[index].image.path}${rows[index].image.name}` : null
        })
        resolve(rows)
      }, reject)
    })
  },

  deleteByCatgoryList: (categoryIds) => {
    return new Promise((resolve, reject) =>
    {
      Product.query(`SET FOREIGN_KEY_CHECKS=0; \
                      DELETE from product WHERE categoryId IN (${categoryIds.join(',')}); \
                      SET FOREIGN_KEY_CHECKS=1`, (err, rows) => {

        if (err) return reject('در هنگام حذف محصولات دسته‌های مورد نظر خطایی رخ داده است.')
        resolve({messages: ['محصولات دسته‌های مورد نظر با موفقیت حذف شدند.']})
      })
    })
  },

  permissionStoreForProduct: (productId, storeId) => {
    return new Promise((resolve, reject) => {
      if(!storeId) return resolve()

      Product.find().where({id: productId, storeId}).exec((err, rows) => {
        if(err || rows.length === 0) return reject('شما دسترسی به این محصول ندارید.')
        return resolve(rows[0])
      })
    })
  },

  addPhoto: (attr) => {
    return new Promise((resolve, reject) =>
    {
      self.permissionStoreForProduct(attr.product_id, attr.store_id).then(() => {
        FileService.addPhoto(attr.photo).then(file => {
          ProductPhoto.create({
            productId: attr.product_id,
            fileId: file.id,
          }).exec((err, model) => {
            if (err) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
            resolve({messages: ['تصویر جدید محصول با موفقیت افزوده شد.'], id: model.id})
          })
        }, () => {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        })
      }, err => {
        reject(err)
      })
    })
  },

  findById: (id) => {
    return new Promise((resolve, reject) =>
    {
      Product.findOne({id}).exec((err, model) => {
        if (err || !model) return reject('محصول مورد نظر یافت نشد.')
        resolve(model)
      })
    })
  },

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, storeId, categoryId, price, discount, quantity, star rate, weight, dimensions, status, reasonRejected, createdAt, updatedAt, \
        nameFa `title.fa`, nameEn `title.en`, \
        descriptionFa `description.fa`, descriptionEn `description.en` \
        FROM `product`'

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

      query = 'SELECT p.*, \
        ph.id `[images].id`, phf.path `[images].path`, phf.name `[images].name`, \
        c.id `category.id`, c.nameFa `category.title.fa`, c.nameEn `category.title.en`, \
        s.id `store.id`, s.nameFa `store.title.fa`, s.nameEn `store.title.en`, \
        a.id `[attributes].id`, a.key `[attributes].key`, a.titleFa `[attributes].title.fa`, a.titleEn `[attributes].title.en`, \
        pa.id `[attributes].[items].id`, IF(pa.increasePrice IS NOT NULL, pa.increasePrice, 0) `[attributes].[items].increase_price`, IF(pa.discount IS NOT NULL, pa.discount, 0) `[attributes].[items].discount`, \
        IF(pa.value IS NOT NULL, pa.value, av.value) `[attributes].[items].value`, \
        IF(pa.value IS NOT NULL, NULL, av.titleFa) `[attributes].[items].title.fa`, \
        IF(pa.value IS NOT NULL, NULL, av.titleEn) `[attributes].[items].title.en` \
      FROM ('+query+') p \
        LEFT JOIN `product_photo` `ph` ON ph.productId = p.id \
          LEFT JOIN `file` `phf` ON phf.id = ph.fileId \
        LEFT JOIN `category` `c` ON c.id = p.categoryId \
        LEFT JOIN `store` `s` ON s.id = p.storeId \
        LEFT JOIN `product_attribute` `pa` ON pa.productId = p.id \
          LEFT JOIN `attribute` `a` ON a.id = pa.attributeId \
          LEFT JOIN `attribute_value` `av` ON av.id = pa.attributeValueId'

      Product.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list[0])
      })
    })
  },

  infoByManager: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id}).then(item => {
        delete item.storeId
        delete item.categoryId
        item.images = item.images.map(image => ({id: image.id, name: image.name, path: `${sails.config.params.staticUrl}${image.path}${image.name}`}))
        resolve(item)
      }, reject)
    })
  },

  infoByStore: (id, storeId) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id, storeId, status: {'!=':'deleted'}}).then(item => {
        delete item.storeId
        delete item.categoryId
        item.images = item.images.map(image => ({id: image.id, name: image.name, path: `${sails.config.params.staticUrl}${image.path}${image.name}`}))
        resolve(item)
      }, reject)
    })
  },

  infoOne: (id) => {
    return new Promise((resolve, reject) =>
    {
      self.info({id, status: 'accepted'}).then(item => {
        delete item.storeId
        delete item.categoryId
        delete item.status
        delete item.reasonRejected
        item.images = item.images.map(image => `${sails.config.params.staticUrl}${image.path}${image.name}`)
        resolve(item)
      }, reject)
    })
  },

  edit: (id, attr, role) => {
    return new Promise((resolve, reject) =>
    {
      if(role === 'store') {
        self.permissionStoreForProduct(id, attr.store_id).then(product => {
          self.update(id, attr).then(resolve, reject)
        }, err => {
          return reject(err)
        })
      }
      else {
        self.update(id, attr).then(resolve, reject)
      }
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      let newAttr = {}

      if(attr.store_id)       newAttr.storeId = attr.store_id
      if(attr.category_id)    newAttr.categoryId = attr.category_id
      if(attr.name_fa)        newAttr.nameFa = attr.name_fa
      if(attr.name_en)        newAttr.nameEn = attr.name_en
      if(attr.description_fa) newAttr.descriptionFa = attr.description_fa
      if(attr.description_en) newAttr.descriptionEn = attr.description_en
      if(attr.price)          newAttr.price = attr.price
      if(attr.discount)       newAttr.discount = attr.discount
      if(attr.quantity)       newAttr.quantity = attr.quantity
      if(attr.weight)         newAttr.weight = attr.weight
      if(attr.dimensions)     newAttr.dimensions = attr.dimensions
      if(attr.status)         newAttr.status = attr.status
      if(attr.reasonRejected) newAttr.reasonRejected = attr.reasonRejected
      newAttr.updatedAt       = moment().format('YYYY-MM-DD HH:mm:ss'),

      Product.update(id, newAttr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['محصول مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },

  delete: (id) => {
    return new Promise((resolve, reject) =>
    {
      Product.update(id, {status: 'deleted'}).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['محصول مورد نظر با موفقیت به حالت حذف شده درآمد.']})
      })
    })
  },

  deleteForce: (id, storeId=null) => {
    return new Promise((resolve, reject) =>
    {
      if(storeId) {
        self.permissionStoreForProduct(id, storeId).then(product => {
          self.deleteById(id).then(resolve, reject)
        }, err => {
          return reject(err)
        })
      }
      else {
        self.deleteById(id).then(resolve, reject)
      }
    })
  },
  
  deleteById: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhotoService.deleteForceByProductId(id).then(() => {
        Product.destroy({id}).exec(err => {
          if(err) return reject('مشکلی پیش آمده است.')
          resolve({messages: ['محصول مورد نظر با موفقیت حذف شد.']})
        })
      })
    })
  },

  addAttribute: (attr, storeId=null) => {
    return new Promise((resolve, reject) =>
    {
      if(storeId) {
        self.permissionStoreForProduct(attr.product_id, storeId).then(product => {
          self.createAttribute(attr).then(resolve, reject)
        }, err => {
          return reject(err)
        })
      }
      else {
        self.createAttribute(attr).then(resolve, reject)
      }
    })
  },

  createAttribute: (attr) => {
    return new Promise((resolve, reject) =>
    {
      if(!attr.attribute_value_id && !attr.value) return reject('خواص مورد نظر باید یک مقدار داشته باشد.')

      let values = []
      if(!Array.isArray(attr.attribute_value_id)) {
        values.push(attr.attribute_value_id)
      }
      else if(attr.attribute_value_id) {
        values = attr.attribute_value_id
      }
      else if(attr.value) {
        values.push(null)
      }

      values.forEach(attributeValueId => {
        ProductAttribute.create({
          productId: attr.product_id,
          attributeId: attr.attribute_id,
          attributeValueId: attributeValueId || null,
          value: attr.value || null,
          increasePrice: attr.increase_price || null,
          discount: attr.discount || null,
          quantity: attr.quantity || null
        }).exec((err, model) => {
          if (err) reject('خطایی رخ داده است، دوباره تلاش کنید.')
          resolve({messages: ['خواص جدید با موفقیت به محصول اضافه شد.'], id: model.id})
        })
      })
    })
  },

  increaseQuantity: (id, count) => {
    return new Promise((resolve, reject) =>
    {
      Product.query('UPDATE `product` SET `quantity` = `quantity` + ? WHERE `id` = ?', [count, id], (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      })
    })
  },

  increaseSale: (id, count) => {
    return new Promise((resolve, reject) =>
    {
      Product.query('UPDATE `product` SET `sale` = `sale` + ? WHERE `id` = ?', [count, id], (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      })
    })
  },

  increaseSaleByInvoiceId: (invoiceId) => {
    return new Promise((resolve, reject) =>
    {
      OrderService.find({invoiceId}).then(orders => {
        orders.forEach(order => {
          self.increaseSale(order.productId, order.count).then().catch()
        })
        resolve()
      }, reject)
    })
  },

  increaseVisit: (id, count=1) => {
    return new Promise((resolve, reject) =>
    {
      Product.query('UPDATE `product` SET `visit` = `visit` + ? WHERE `id` = ?', [count, id], (err, rows) => {
        if(err) return reject(err)
        resolve(rows)
      })
    })
  },
}

