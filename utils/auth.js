const jwt = require('jsonwebtoken');
const config = require('../config/index');
const userModel = require('../modules/Brokers/schema');
const bcrypt = require('bcrypt');

exports.generateToken = function (user) {
  const userData = {
    userId: user,
  };
  return jwt.sign(userData, config.secret);
};

exports.jwt = function (req, res, next) {
  const token = req.headers['authorization'];
  const result = token ? token.substr(token.indexOf(' ') + 1) : false;
  if (!result) {
    return res.status(403).send({ 'status': false, 'code': 403, 'message': 'Unauthorized !' });
  }
  jwt.verify(result, config.secret, async function (err, decoded) {

    if (decoded) {
      var userExist = await userModel.findById({ _id: decoded.userId.userId });
    }

    if (err) {
      return res.status(500).send({ 'status': false, 'code': 500, 'message': 'Failed to authenticate token. !' });
    }
    if (userExist) {
      if (userExist.group == 2) {
        req.isAdmin = true;
      }
      req.user = userExist;
      return next();
    }
  });
};
