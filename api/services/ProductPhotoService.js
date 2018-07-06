const self = module.exports = {

  findByProductId: (id) => {
    return new Promise((resolve, reject) =>
    {
      ProductPhoto.find({productId: id}).exec((err, rows) => {
        if(err || rows.length === 0) return reject()
        resolve(rows)
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
}