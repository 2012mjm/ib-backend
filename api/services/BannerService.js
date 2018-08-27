const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir

const self = module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      FileService.addPhoto(attr.image).then(res => {
        attr.imageId = res.id
        self.create(attr).then(resolve, reject)
      })
    })
  },

  edit: (id, attr) => {
    return new Promise((resolve, reject) =>
    {
      if(attr.image._files.length > 0) {
        FileService.addPhoto(attr.image).then(res => {
          attr.imageId = res.id
          self.update(id, attr).then(resolve, reject)
        })
      }
      else {
        attr.image.upload({noop: true})
        self.update(id, attr).then(resolve, reject)
      }
    })
  },

  create: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Banner.create({
        type: attr.type,
        imageId: attr.imageId,
        linkType: attr.link_type || null,
        link: attr.link || null
      }).exec((err, model) => {
        if (err) {
          return reject(err)
        }

        if (model) {
          resolve({messages: ['بنر جدید با موفقیت ایجاد شد.'], id: model.id})
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

      if(attr.type)       newAttr.type = attr.type
      if(attr.link_type)  newAttr.linkType = attr.link_type
      if(attr.imageId)    newAttr.imageId = attr.imageId
      if(attr.link)       newAttr.link = attr.link

      Banner.update({id: id}, newAttr).exec((err, model) => {
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
        resolve({messages: ['بنر مورد نظر با موفقیت ویرایش شد.']})
      })
    })
  },

  delete: (id) => {
    return new Promise((resolve, reject) =>
    {
      Banner.destroy({id}).exec(err => {
        if(err) return reject('مشکلی پیش آمده است.')
        resolve({messages: ['بنر مورد نظر با موفقیت حذف شد.']})
      })
    })
  },

  list: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT b.id, b.type, b.linkType `link_type`, b.link, CONCAT("'+sails.config.params.staticUrl+'", f.path, f.name) image \
        FROM banner b \
          LEFT JOIN `file` f ON f.id = b.imageId \
        ORDER BY b.id DESC'

      Banner.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list)
      })
    })
  },

  info: (id) => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT b.id, b.type, b.linkType `link_type`, b.link, CONCAT("'+sails.config.params.staticUrl+'", f.path, f.name) image \
        FROM banner b \
          LEFT JOIN `file` f ON f.id = b.imageId \
        WHERE b.id = ? \
        ORDER BY b.id DESC'

      Banner.query(query, [id], (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list[0])
      })
    })
  },
}
