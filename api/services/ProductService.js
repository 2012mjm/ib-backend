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

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, storeId, categoryId, price, discount, quantity, star, status, rejectReason, createdAt, updatedAt, \
        nameFa `title.fa`, nameEn `title.en` \
        FROM `product`'

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

      query = 'SELECT p.*, \
        phf.id `images.id`, phf.path `images.path`, phf.name `images.name`, \
        c.nameFa `category.fa`, c.nameEn `category.en`, \
        s.nameFa `store.fa`, s.nameEn `store.en` \
      FROM ('+query+') p \
        LEFT JOIN `product_photo` `ph` ON ph.productId = p.id \
          LEFT JOIN `file` `phf` ON phf.id = ph.fileId \
        LEFT JOIN `category` `c` ON c.id = p.categoryId \
        LEFT JOIN `store` `s` ON s.id = p.storeId'

      if(sort) {
        query += ` ORDER BY ?`
        dataQuery.push(sort)
      }
      
      Category.query(query, dataQuery, (err, rows) => {
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

  listByStore: (criteria, page, count, sort) => {
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
          delete rows[index].status
          delete rows[index].rejectReason
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
        return resolve()
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
  }
}

