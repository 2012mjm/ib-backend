os = require('os')
os.tmpDir = os.tmpdir
var moment = require('moment')

module.exports = {

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
        status: 'pending',
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec((err, model) => {
        // console.log(err)
        if (err) {
          return reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }

        if (model) {
          resolve({message: ['محصول جدید با موفقیت ایجاد شد.'], id: model.id})
        } else {
          reject('خطایی رخ داده است، دوباره تلاش کنید.')
        }
      })
    })
  },
}

