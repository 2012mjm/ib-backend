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
      if(attr.parentId)   newAttr.parentId = attr.parentId
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
              name: {
                fa: row.nameFa,
                en: row.nameEn,
              },
              color: row.color,
              photo: (row.photoId) ? `${sails.config.params.apiUrl}${row.photoPath}${row.photoName}` : null
            }
          }
          else if(row.pId2 === null) {
            if(list[row.pId].child === undefined) list[row.pId].child = []

            list[row.pId].child[row.id] = {
              id: row.id,
              name: {
                fa: row.nameFa,
                en: row.nameEn,
              },
              photo: (row.photoId) ? `${sails.config.params.apiUrl}${row.photoPath}${row.photoName}` : null
            }
          }
          else {
            if(list[row.pId2].child[row.pId].child === undefined) list[row.pId2].child[row.pId].child = []

            list[row.pId2].child[row.pId].child[row.id] = {
              id: row.id,
              name: {
                fa: row.nameFa,
                en: row.nameEn,
              },
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
