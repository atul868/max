const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;


const {addReview} = require('./controller')
const { addReviewVailidate } = require('./vailidator')

module.exports = (app) => {

    app.post('/addReview', authCheck, middleware(addReviewVailidate), hasRole([1, 2]), addReview);

};