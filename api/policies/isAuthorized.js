/**
 * isAuthorized
 *
 * @description :: Policy to check if user is authorized with JSON web token
 * @help        :: See http://sailsjs.org/#!/documentation/concepts/Policies
 */

module.exports = async (req, res, next) => {
  let token;

  if (req.headers && req.headers.authorization) {
    let parts = req.headers.authorization.split(' ');
    if (parts.length == 2) {
      let scheme = parts[0],
        credentials = parts[1];

      if (/^Bearer$/i.test(scheme)) {
        token = credentials;
      }
    } else {
      return res.status(401).json({_errors: ['Format is Authorization: Bearer [token]']})
    }
  } else if (req.param('token')) {
    token = req.param('token');
    // We delete the token from param to not mess with blueprints
    delete req.query.token;
  } else {
    return res.status(401).json({_errors: ['No Authorization header was found']})
  }

  JwtService.verify(token, (err, token) => {
    if (err) return res.status(401).json({_errors: ['Invalid Token!']})
    req.token = token; // This is the decrypted token or the payload you provided
    next();
  });
};
