const TextHelper = require('../../helper/TextHelper')

module.exports = (req, res, next) => {
  
  if(req.body !== undefined) {
    Object.keys(req.body).forEach(key => {
      if(typeof req.body[key] === 'string' || req.body[key] instanceof String) {
        req.body[key] = TextHelper.toEnglishDigits(req.body[key])
      }
    })
  }

  next();
};


