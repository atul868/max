const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

const {
    create,
    get,
    edit,
    remove,
} = require('./controller')
const { createnotificationVailidate, editnotificationVailidate, removenotificationVailidate } = require('./vailidator')

module.exports = (app) => {

    app.post('/notification/create', authCheck, middleware(createnotificationVailidate), hasRole([2]), create);
    app.get('/notification/get', authCheck, hasRole([1, 2]), get);
    app.post('/notification/edit', authCheck, middleware(editnotificationVailidate), hasRole([2]), edit);
    app.post('/notification/remove', authCheck, hasRole([1, 2]), middleware(removenotificationVailidate), remove);
};