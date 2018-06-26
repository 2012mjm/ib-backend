os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

module.exports = {

  add: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Subcategory.create(Object.assign(attr, {
        categoryId: attr.category_id,
        name: attr.name,
      })).exec(function (err, model) {
        if (err) {
          return reject(err)
        }

        if (model) {
          resolve({message: ['زیر دسته جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },
}
