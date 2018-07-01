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
        weight: attr.weight,
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
      let query = 'SELECT p.id, p.storeId, p.categoryId, p.price, p.discount, p.quantity, p.star, p.status, p.rejectReason, p.createdAt, p.updatedAt, \
        p.nameFa `title.fa`, p.nameEn `title.en`, \
        phf.id `images.id`, phf.path `images.path`, phf.name `images.name`, \
        c.nameFa `category.fa`, c.nameEn `category.en`, \
        s.nameFa `store.fa`, s.nameEn `store.en` \
      FROM `product` `p` \
        LEFT JOIN `product_photo` `ph` ON ph.productId = p.id \
          LEFT JOIN `file` `phf` ON phf.id = ph.fileId \
        LEFT JOIN `category` `c` ON c.id = p.categoryId \
        LEFT JOIN `store` `s` ON s.id = p.storeId'

      dataQuery = []
      where = []

      Object.keys(criteria).forEach(key => {
        if(criteria[key] === null) return delete criteria[key]
        where.push(`${key} = ?`)
        dataQuery.push(criteria[key])
      })

      if(where) {
        query += ` WHERE ${where.join(' AND ')}`
      }
      if(sort) {
        query += ` ORDER BY ?`
        dataQuery.push(sort)
      }
      if(count) {
        query += ` LIMIT ?`
        dataQuery.push(parseInt(count, 10))
      }
      if(count && page) {
        query += ` OFFSET ?`
        dataQuery.push((page-1)*count)
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
  }
}

