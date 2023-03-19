const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;
const { createFlag } = require('./controller')
const { addFlagVailidate } = require('./vailidator')
module.exports = (app) => {
  app.post('/createFlag', authCheck,authCheck,middleware(addFlagVailidate), hasRole([1, 2]), createFlag);
};