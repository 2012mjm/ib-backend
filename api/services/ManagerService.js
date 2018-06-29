os = require('os')
os.tmpDir = os.tmpdir
const moment = require('moment')

module.exports = {

  signup: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Manager.create({
        username: attr.username,
        password: attr.password,
        email: attr.email,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, manager) {
        if (err) {
          return reject('مشکلی پیش آمده است دوباره تلاش کنید.')
        }

        if (manager) {
          resolve({token: JwtService.issue({ managerId: manager.id, role: 'manager', isAdmin: true })})
        } else {
          reject('مشکلی پیش آمده است دوباره تلاش کنید.')
        }
      })
    })
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Manager.findOne({username: attr.username}, function (err, manager) {
        if (!manager) {
          return reject('نام کاربری یا کلمه عبور صحیح نمی باشد.')
        }

        Manager.comparePassword(attr.password, manager, function (err, valid) {
          if (err) {
            return reject('نام کاربری یا کلمه عبور صحیح نمی باشد.')
          }

          if (!valid) {
            return reject('نام کاربری یا کلمه عبور صحیح نمی باشد.')
          } else {
            resolve({
              id: manager.id,
              username: manager.username,
              email: manager.email,
              token: JwtService.issue({ managerId: manager.id, role: 'manager', isAdmin: true }, attr.remember_me)
            })
          }
        })
      })
    })
  },
}
