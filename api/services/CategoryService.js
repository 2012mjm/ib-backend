const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.photo._files.length > 0) {
        FileService.addPhoto(attr.photo).then(res => {
          attr.photoId = res.id
          self.create(attr).then(resolve, reject)
        })
      }
      else {
        attr.photo.upload({noop: true})
        self.create(attr).then(resolve, reject)
      }
    })
  },

  edit: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.photo._files.length > 0) {
        FileService.addPhoto(attr.photo).then(res => {
          attr.photoId = res.id
          self.update(id, attr).then(resolve, reject)
        })
      }
      else {
        attr.photo.upload({noop: true})
        self.update(id, attr).then(resolve, reject)
      }
    })
  },

  create: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Category.create({
        nameFa: attr.name_fa,
        nameEn: attr.name_en || null,
        photoId: attr.photoId || null,
        parentId: attr.parent_id || null,
        color: attr.color || null
      }).exec((err, model) => {
        if (err) {
          return reject(err)
        }

        if (model) {
          resolve({messages: ['دسته جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      let newAttr = {}

      if(attr.name_fa)    newAttr.nameFa = attr.name_fa
      if(attr.name_en)    newAttr.nameEn = attr.name_en
      if(attr.photoId)    newAttr.photoId = attr.photoId
      if(attr.parent_id)  newAttr.parentId = attr.parent_id
      if(attr.color)      newAttr.color = attr.color

      Category.update({id: id}, newAttr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['دسته مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },

  delete: (id) => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id c1, c2.id c2, c3.id c3 FROM `category` c \
                      LEFT JOIN category c2 ON c2.parentId = c.id \
                      LEFT JOIN category c3 ON c3.parentId = c2.id \
                      WHERE c.id = ? \
                      ORDER BY c3.id DESC, c2.id DESC'
                      
      Category.query(query, [id], (err, rows) => {
        if (err || rows.length === 0) return reject('دسته ای برای حذف یافت نشد.')

        listIds = []
        rows.forEach(row => {
          if(row.c3 !== null && listIds.indexOf(row.c3) === -1) listIds.push(row.c3)
          if(row.c2 !== null && listIds.indexOf(row.c2) === -1) listIds.push(row.c2)
          if(row.c1 !== null && listIds.indexOf(row.c1) === -1) listIds.push(row.c1)
        })
        listIds = listIds.sort((a, b) => b - a)

        ProductService.deleteByCatgoryList(listIds).then(() =>
        {
          Category.query(`SET FOREIGN_KEY_CHECKS=0; \
                            DELETE from category WHERE id IN (${listIds.join(',')}); \
                            SET FOREIGN_KEY_CHECKS=1`, (err, rows) => {

            if (err) return reject('دسته‌های مورد نظر حذف نشد، دوباره تلاش کنید.')

            resolve({messages: ['دسته مورد نظر و زیر دسته‌های آن با موفقیت حذف شد.']})
          })
        }, err => {
          return reject(err)
        })
      })
    })
  },

  list: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id, c.parentId `parent_id`, c.nameFa `name.fa`, c.nameEn `name.en`, c.color, CONCAT("'+sails.config.params.apiUrl+'", f.path, f.name) image, \
        c2.id `[child].id`, c2.parentId `[child].parent_id`, c2.nameFa `[child].name.fa`, c2.nameEn `[child].name.en`, c2.color `[child].color`, CONCAT("'+sails.config.params.apiUrl+'", f2.path, f2.name) `[child].image`, \
        c3.id `[child].[child].id`, c3.parentId `[child].[child].parent_id`, c3.nameFa `[child].[child].name.fa`, c3.nameEn `[child].[child].name.en`, c3.color `[child].[child].color`, CONCAT("'+sails.config.params.apiUrl+'", f3.path, f3.name) `[child].[child].image` \
        FROM category c \
          LEFT JOIN `file` f ON f.id = c.photoId \
          LEFT JOIN category c2 ON c2.parentId = c.id \
            LEFT JOIN `file` f2 ON f2.id = c2.photoId \
            LEFT JOIN category c3 ON c3.parentId = c2.id \
              LEFT JOIN `file` f3 ON f3.id = c3.photoId \
        WHERE c.parentId IS NULL \
        ORDER BY c.parentId ASC, c.id ASC, c2.id ASC, c3.id ASC'

      Category.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list)
      })
    })
  },

  listByManagerAndStore: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id, c.parentId `parent_id`, c.nameFa `name.fa`, c.nameEn `name.en`, c.color, f.path `photo.path`, f.name `photo.name`, \
        a.id `[product_attributes].id`, a.key `[product_attributes].key`, a.titleFa `[product_attributes].title.fa`, a.titleEn `[product_attributes].title.en`, ca.isMultiple `[product_attributes].is_multiple`, ca.isRequired `[product_attributes].is_required`, \
        c2.id `[child].id`, c2.parentId `[child].parent_id`, c2.nameFa `[child].name.fa`, c2.nameEn `[child].name.en`, c2.color `[child].color`, f2.path `[child].photo.path`, f2.name `[child].photo.name`, \
        a2.id `[child].[product_attributes].id`, a2.key `[child].[product_attributes].key`, a2.titleFa `[child].[product_attributes].title.fa`, a2.titleEn `[child].[product_attributes].title.en`, ca2.isMultiple `[child].[product_attributes].is_multiple`, ca2.isRequired `[child].[product_attributes].is_required`, \
        c3.id `[child].[child].id`, c3.parentId `[child].[child].parent_id`, c3.nameFa `[child].[child].name.fa`, c3.nameEn `[child].[child].name.en`, c3.color `[child].[child].color`, f3.path `[child].[child].photo.path`, f3.name `[child].[child].photo.name`, \
        a3.id `[child].[child].[product_attributes].id`, a3.key `[child].[child].[product_attributes].key`, a3.titleFa `[child].[child].[product_attributes].title.fa`, a3.titleEn `[child].[child].[product_attributes].title.en`, ca3.isMultiple `[child].[child].[product_attributes].is_multiple`, ca3.isRequired `[child].[child].[product_attributes].is_required` \
        FROM category c \
          LEFT JOIN `file` f ON f.id = c.photoId \
          LEFT JOIN `category_attribute` `ca` ON ca.categoryId = c.id \
            LEFT JOIN `attribute` `a` ON a.id = ca.attributeId \
          LEFT JOIN category c2 ON c2.parentId = c.id \
            LEFT JOIN `file` f2 ON f2.id = c2.photoId \
            LEFT JOIN `category_attribute` `ca2` ON ca2.categoryId = c2.id \
              LEFT JOIN `attribute` `a2` ON a2.id = ca2.attributeId \
            LEFT JOIN category c3 ON c3.parentId = c2.id \
              LEFT JOIN `file` f3 ON f3.id = c3.photoId \
              LEFT JOIN `category_attribute` `ca3` ON ca3.categoryId = c3.id \
                LEFT JOIN `attribute` `a3` ON a3.id = ca3.attributeId \
        WHERE c.parentId IS NULL \
        ORDER BY c.parentId ASC, c.id ASC, c2.id ASC, c3.id ASC'

      Category.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list)
      })
    })
  },

  info: (id) => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id, c.parentId `parent_id`, c.nameFa `name.fa`, c.nameEn `name.en`, c.color, f.path `photo.path`, f.name `photo.name` \
        FROM category c \
          LEFT JOIN `file` f ON f.id = c.photoId \
        WHERE c.id = ?'

      Category.query(query, [id], (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list[0])
      })
    })
  },

  infoByManagerAndStore: (id) => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id, c.parentId `parent_id`, c.nameFa `name.fa`, c.nameEn `name.en`, c.color, f.path `photo.path`, f.name `photo.name`, \
        a.id `[product_attributes].id`, a.key `[product_attributes].key`, a.titleFa `[product_attributes].title.fa`, a.titleEn `[product_attributes].title.en`, ca.isMultiple `[product_attributes].is_multiple`, ca.isRequired `[product_attributes].is_required`, \
        av.id `[product_attributes].[values].id`, av.titleFa `[product_attributes].[values].title.fa`, av.titleEn `[product_attributes].[values].title.en` \
        FROM category c \
          LEFT JOIN `file` f ON f.id = c.photoId \
          LEFT JOIN `category_attribute` `ca` ON ca.categoryId = c.id \
            LEFT JOIN `attribute` `a` ON a.id = ca.attributeId \
          LEFT JOIN `attribute_value` `av` ON av.attributeId = a.id \
        WHERE c.id = ?'

      Category.query(query, [id], (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list[0])
      })
    })
  },

  addAttribute: (attr) => {
    return new Promise((resolve, reject) =>
    {
      CategoryAttribute.findOne({categoryId: attr.category_id, attributeId: attr.attribute_id}).exec((err, model) =>
      {
        if (model) return reject('این خواص برای دسته مورد نظر قبلا ثبت شده است.')

        CategoryAttribute.create({
          categoryId: attr.category_id,
          attributeId: attr.attribute_id,
          isRequired: (attr.is_required === null) ? 0 : attr.is_required,
          isMultiple: (attr.is_multiple === null) ? 1 : attr.is_multiple
        }).exec((err, model) => {
          if (err) return reject(err)
          resolve({messages: ['خواص با موفقیت به دسته مورد نظر اضافه شد.'], id: model.id})
        })
      })
    })
  },
}
