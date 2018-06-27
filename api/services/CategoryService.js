os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

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

  create: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Category.create({
        nameFa: attr.name_fa,
        nameEn: attr.name_en || null,
        photoId: attr.photoId || null,
        parentId: attr.parentId || null,
        color: attr.color || null
      }).exec((err, model) => {
        if (err) {
          return reject(err)
        }

        if (model) {
          resolve({message: ['دسته جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },

  list: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.*, file.path photoPath, file.name photoName, \
                      c2.id pId, c2.nameFa pNameFa, \
                      c3.id pId2, c3.nameFa pNameFa2 \
                      FROM `category` `c` \
                      LEFT JOIN `category` `c2` ON c2.id = c.parentId \
                      LEFT JOIN `category` `c3` ON c3.id = c2.parentId \
                      LEFT JOIN `file` ON file.id = c.photoId \
                      ORDER BY c.parentId ASC, c.id ASC'
                      
      Category.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        let list = []
        rows.forEach(row => {
          if(row.pId === null && row.pId2 === null) {
            list[row.id] = {
              id: row.id,
              name_fa: row.nameFa,
              name_en: row.nameEn,
              color: row.color,
              photo: (row.photoId) ? `${sails.config.params.apiUrl}${row.photoPath}${row.photoName}` : null
            }
          }
          else if(row.pId2 === null) {
            if(list[row.pId].child === undefined) list[row.pId].child = []

            list[row.pId].child[row.id] = {
              id: row.id,
              name_fa: row.nameFa,
              name_en: row.nameEn,
              photo: (row.photoId) ? `${sails.config.params.apiUrl}${row.photoPath}${row.photoName}` : null
            }
          }
          else {
            if(list[row.pId2].child[row.pId].child === undefined) list[row.pId2].child[row.pId].child = []

            list[row.pId2].child[row.pId].child[row.id] = {
              id: row.id,
              name_fa: row.nameFa,
              name_en: row.nameEn,
            }
          }
        })

        for (let i=0; i<list.length; i++) {
          if (list[i] === undefined) {    
            list.splice(i, 1)
            i--
            continue
          }

          if(list[i].child) {
            for (let j=0; j<list[i].child.length; j++) {
              if (list[i].child[j] === undefined) {
                list[i].child.splice(j, 1)
                j--
                continue
              }

              if(list[i].child[j].child) {
                for (let k=0; k<list[i].child[j].child.length; k++) {
                  if (list[i].child[j].child[k] === undefined) {
                    list[i].child[j].child.splice(k, 1)
                    k--
                  }
                }
              }
            }
          }
        }

        resolve(list)
      })
    })
  },
}
