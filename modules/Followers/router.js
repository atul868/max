const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;
const { addFollowVailidate, deleteFollowVailidate } = require('./vailidator')
const {
  addFollow,
  deleteFollow
} = require('./controller')
module.exports = (app) => {
  app.post('/addFollow', authCheck,middleware(addFollowVailidate),hasRole([1, 2]), addFollow);
  app.post('/deleteFollow', authCheck, middleware(deleteFollowVailidate), hasRole([1, 2]), deleteFollow);
};