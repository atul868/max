const hasRole = require('../../middlewares/hasRole');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

const {getConstant} = require('./controller')

module.exports = (app) => {

    app.get('/getConstant', authCheck, hasRole([1, 2]), getConstant);

};