const self = module.exports = {

  findByProductId: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhoto.find({productId: id}).exec((err, rows) => {
        if(err || rows.length === 0) return reject('تصویر مورد نظر یافت نشد.')
        resolve(rows)
      })
    })
  },

  findById: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhoto.findOne(id).exec((err, row) => {
        if(err || !row) return reject('تصویر مورد نظر یافت نشد.')
        resolve(row)
      })
    })
  },

  deleteForceByProductId: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhoto.destroy({productId: id}).exec(err => {
        if(err) return resolve()
        resolve()
      })
    })
  },

  deleteByAccess: (id, storeId=null) => {
    return new Promise((resolve, reject) =>
    {
      self.findById(id).then(photo => {
        if(storeId) {
          ProductService.permissionStoreForProduct(photo.productId, storeId).then(() => {
            self.deleteById(id).then(resolve, reject)
          }, reject)
        }
        else {
          self.deleteById(id).then(resolve, reject)
        }
      }, reject)
    })
  },

  deleteById: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhoto.destroy({id}).exec(err => {
        if(err) return reject('مشکلی پیش آمده است.')
        resolve({messages: ['تصویر مورد نظر با موفقیت حذف شد.']})
      })
    })
  },
}