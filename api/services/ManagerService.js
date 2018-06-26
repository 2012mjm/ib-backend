os = require('os');
os.tmpDir = os.tmpdir;
var moment = require('moment');

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
          return reject(err);
        }

        if (manager) {
          resolve({token: JwtService.issue({ managerId: manager.id, role: 'manager', isAdmin: true })});
        } else {
          reject(sails.__('Error in signup'));
        }
      });
    });
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      Manager.findOne({username: attr.username}, function (err, manager) {
        if (!manager) {
          return reject('invalid username or password');
        }

        Manager.comparePassword(attr.password, manager, function (err, valid) {
          if (err) {
            return reject('forbidden');
          }

          if (!valid) {
            return reject('invalid username or password');
          } else {
            resolve({
              id: manager.id,
              username: manager.username,
              email: manager.email,
              token: JwtService.issue({ managerId: manager.id, role: 'manager', isAdmin: true }, attr.remember_me)
            });
          }
        });
      });
    });
  },
}
