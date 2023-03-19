const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;
const { createSold } = require('./controller')
const { addSoldPropertyVailidate } = require('./vailidator')
module.exports = (app) => {
  app.post('/createSold', authCheck,/**  middleware(addSoldPropertyVailidate),*/ hasRole([1, 2]), createSold);
};