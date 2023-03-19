const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

const { create, get, remove } = require('./controller')
const { propertyBookMarkValidate } = require('./vailidator')


module.exports = (app) => {

  app.post('/create', authCheck, middleware(propertyBookMarkValidate), create);
  app.get('/get', authCheck, get);
  app.delete('/delete/:_id', authCheck, hasRole([1, 2]), remove);
}