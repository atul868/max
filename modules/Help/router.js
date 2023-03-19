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

const { createHelpVailidate, getHelpVailidate, editHelpVailidate, removeHelpVailidate } = require('./vailidator')

module.exports = (app) => {

    app.post('/help/create', authCheck, middleware(createHelpVailidate), hasRole([1]), create);
    app.get('/help/get', authCheck, middleware(getHelpVailidate), hasRole([1, 2]), get);
    app.post('/help/edit', authCheck, middleware(editHelpVailidate), hasRole([1]), edit);
    app.post('/help/remove', authCheck, hasRole([1]), middleware(removeHelpVailidate), remove);
};