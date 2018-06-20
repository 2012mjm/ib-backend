/**
 * @description :: JSON Webtoken Service for sails
 * @help        :: See https://github.com/auth0/node-jsonwebtoken & http://sailsjs.org/#!/documentation/concepts/Services
 */
 
var jwt = require('jsonwebtoken');
var tokenSecret = "BackIraniEndBekharim!@#";

// Generates a token from supplied payload
module.exports.issue = function(payload, rememberMe) {
  if(rememberMe) {
    expiresIn = 60*60*24*365;
  } else {
    expiresIn = 60*60*24*7;
  }

  return jwt.sign(
    payload,
    tokenSecret, // Token Secret that we sign it with
    {
      expiresIn : expiresIn // Token Expire time
    }
  );
};

// Verifies token on a request
module.exports.verify = function(token, callback) {
  return jwt.verify(
    token, // The token to be verified
    tokenSecret, // Same token we used to sign
    {}, // No Option, for more see https://github.com/auth0/node-jsonwebtoken#jwtverifytoken-secretorpublickey-options-callback
    callback //Pass errors or decoded token to callback
  );
};
