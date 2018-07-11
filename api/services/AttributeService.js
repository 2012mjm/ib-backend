const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Attribute.create({
        key: attr.key,
        titleFa: attr.title_fa,
        titleEn: attr.title_en || null
      }).exec((err, model) => {
        if (err || !model) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['خواص جدید با موفقیت ایجاد شد.'], id: model.id})
      })
    })
  },

  addValue: (attr) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.image._files.length > 0) {
        FileService.addPhoto(attr.image).then(res => {
          attr.photoId = res.id
          self.createValue(attr).then(resolve, reject)
        })
      }
      else {
        attr.image.upload({noop: true})
        self.createValue(attr).then(resolve, reject)
      }
    })
  },

  createValue: (attr) => {
    return new Promise((resolve, reject) =>
    {
      AttributeValue.create({
        attributeId: attr.attribute_id,
        titleFa: attr.title_fa,
        titleEn: attr.title_en || null,
        value: attr.value || null,
        photoId: attr.photoId || null,
      }).exec((err, model) => {
        if (err || !model) return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        resolve({messages: ['مقدار جدید خواص با موفقیت ایجاد شد.'], id: model.id})
      })
    })
  },

  list: (criteria, page, count, sort) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, `key`, titleFa `title.fa`, titleEn `title.en` FROM `attribute`'

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

      Attribute.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list)
      })
    })
  },

  findById: (id) => {
    return new Promise((resolve, reject) =>
    {
      Attribute.findOne({id}).exec((err, model) => {
        if (err || !model) return reject('خواص مورد نظر یافت نشد.')
        resolve(model)
      })
    })
  },

  info: (criteria) => {
    return new Promise((resolve, reject) =>
    {
      let query = 'SELECT id, `key`, titleFa `title.fa`, titleEn `title.en` FROM `attribute`'

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

      query = 'SELECT a.*, \
        av.id `[values].id`, av.titleFa `[values].title.fa`, av.titleEn `[values].title.en`, av.value `[values].value`, \
        CONCAT("'+sails.config.params.apiUrl+'", f.path, f.name) `[values].image` \
      FROM ('+query+') a \
        LEFT JOIN `attribute_value` `av` ON av.attributeId = a.id \
          LEFT JOIN `file` `f` ON f.id = av.photoId'

      Attribute.query(query, dataQuery, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list[0])
      })
    })
  },

  update: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      let newAttr = {}

      if(attr.key)      newAttr.key = attr.key
      if(attr.title_fa) newAttr.titleFa = attr.title_fa
      if(attr.title_en) newAttr.titleEn = attr.title_en

      Attribute.update(id, newAttr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['خواص مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },
  
  delete: (id) => {
    return new Promise((resolve, reject) =>
    {
      Attribute.destroy({id}).exec(err => {
        if(err) return reject('مشکلی پیش آمده است.')
        resolve({messages: ['خواص مورد نظر با موفقیت حذف شد.']})
      })
    })
  }
}

