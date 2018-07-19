const ModelHelper = require('../../helper/ModelHelper')

os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

const self = module.exports = {

  list: () => {
    return new Promise((resolve, reject) =>
    {
      const query = 'SELECT p.id, p.name, c.id `[cities].id`, c.name `[cities].name` \
        FROM `province` p \
          INNER JOIN `city` c ON c.provinceId = p.id \
          ORDER BY p.id ASC, c.id ASC'

      Province.query(query, (err, rows) => {
        if (err || rows.length === 0) return reject('موردی یافت نشد.')

        list = ModelHelper.ORM(rows)
        resolve(list)
      })
    })
  },
}
