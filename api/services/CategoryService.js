os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Category.create(Object.assign(attr, {
        name: attr.name,
      })).exec(function (err, model) {
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

  getList: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT c.id id, c.name name, sc.name childName, sc.id childId FROM `category` `c` \
                      LEFT JOIN `subcategory` `sc` ON sc.categoryId = c.id \
                      ORDER BY c.id ASC, sc.id ASC'
                      
      Category.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        let list = []
        rows.forEach(row => {
          if(list[row.id] !== undefined) {
            list[row.id].child.push({
              id: row.childId,
              name: row.childName,
            })
          } else {
            list[row.id] = {
              id: row.id,
              name: row.name,
              child: [{
                id: row.childId,
                name: row.childName,
              }]
            }
          }
        })

        cleanList = []
        list.forEach(item => {
          console.log('1', item)
          if(item !== undefined) cleanList.push(item)
        })

        resolve(cleanList)
      })
    })
  },
}
