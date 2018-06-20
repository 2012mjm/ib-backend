os = require('os');
os.tmpDir = os.tmpdir;
var moment = require('moment');

module.exports = {

  signup: (attr) => {
    return new Promise((resolve, reject) =>
    {
      User.create({
        username: attr.username,
        password: attr.password,
        email: attr.email,
        createdAt: moment().format('YYYY-MM-DD HH:mm:ss'),
      }).exec(function (err, user) {
        if (err) {
          return reject(err);
        }

        if (user) {
          resolve({token: JwtService.issue({ userId: user.id })});
        } else {
          reject(sails.__('Error in signup'));
        }
      });
    });
  },

  login: (attr) => {
    return new Promise((resolve, reject) =>
    {
      User.findOne({username: attr.username}, function (err, user) {
        if (!user) {
          return reject('invalid username or password');
        }

        User.comparePassword(attr.password, user, function (err, valid) {
          if (err) {
            return reject('forbidden');
          }

          if (!valid) {
            return reject('invalid username or password');
          } else {
            resolve({
              user: {
                username: user.username
              },
              token: JwtService.issue({ userId : user.id }, attr.remember_me)
            });
          }
        });
      });
    });
  },


}
