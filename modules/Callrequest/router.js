const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

var multer = require("multer");
const upload = multer({ dest: "uploads/" });
const imageUpload = upload.fields([{ name: "profileImage", maxCount: 1 }]);
const {
  getCallRequest, callRequest, deletecallRequest, dealConnect
} = require('./controller')

const { getCallReqValidate, deletecallReqValidate } = require('./vailidator')

module.exports = (app) => {
  app.get('/dealConnect', authCheck, hasRole([1, 2]), dealConnect);
  app.get('/getCallRequest', authCheck, hasRole([1, 2]), getCallRequest);
  app.post('/callRequest', authCheck, middleware(getCallReqValidate), hasRole([1, 2]), callRequest);
  app.post('/deletecallRequest', authCheck, middleware(deletecallReqValidate), hasRole([1, 2]), deletecallRequest);
};