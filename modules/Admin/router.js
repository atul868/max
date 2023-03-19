const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

const { adminLogin, createPropertyDeveloper, getPropertyDeveloper, updatePropertyDeveloper, deletePropertyDeveloper,
    createPropertyProject, getPropertyProject, updatePropertyProject, deletePropertyProject, assignSuperBroker,
    propertySearchAdmin, brokerGet, propertyFilterAdmin, brokerFilterAdmin, developerSearchAdmin,
    projectFilterAdmin, developerFilterAdmin, projectSearchAdmin, getAllDeveloper, getAllProject, adminLogout,
    stateSearch, citySearch, localitySearch
} = require('./controller')
const { createPropertyDeveloperValidate, updatePropertyDeveloperValidate, createPropertyProjectValidate,
    updatePropertyProjectValidate, propertySearchAdminValidate, brokerSearchAdminValidate, propertyFilterAdminValidate,
    brokerFilterAdminValidate, developerSearchAdminValidate, developerFilterAdminValidate,
    projectSearchAdminValidate, projectFilterAdminValidate, stateSearchValidate } = require('./vailidator')

module.exports = (app) => {

    app.post('/adminLogin', adminLogin);
    app.get('/adminLogout', authCheck, hasRole([2]), adminLogout);

    app.post('/createPropertyDeveloper', authCheck, hasRole([2]), middleware(createPropertyDeveloperValidate), createPropertyDeveloper);
    app.get('/getPropertyDeveloper', authCheck, hasRole([1, 2]), getPropertyDeveloper);
    app.put('/updatePropertyDeveloper', authCheck, hasRole([2]), middleware(updatePropertyDeveloperValidate), updatePropertyDeveloper);
    app.delete('/deletePropertyDeveloper/:id', authCheck, hasRole([2]), deletePropertyDeveloper);

    app.get('/getAllDeveloper', authCheck, hasRole([1, 2]), getAllDeveloper);

    app.post('/createPropertyProject', authCheck, hasRole([2]), middleware(createPropertyProjectValidate), createPropertyProject);
    app.get('/getPropertyProject', authCheck, hasRole([2]), getPropertyProject);
    app.put('/updatePropertyProject', authCheck, hasRole([2]), middleware(updatePropertyProjectValidate), updatePropertyProject);
    app.delete('/deletePropertyProject/:id', authCheck, hasRole([2]), deletePropertyProject);

    app.get('/getAllProject', authCheck, hasRole([1, 2]), getAllProject);

    app.post('/assignSuperBroker', authCheck, hasRole([2]), assignSuperBroker);

    app.post('/propertySearchAdmin', authCheck, middleware(propertySearchAdminValidate), hasRole([2]), propertySearchAdmin);
    app.get('/propertyFilterAdmin', authCheck, hasRole([2]), /*middleware(propertyFilterAdminValidate),*/ propertyFilterAdmin);

    /* broker get search and filter comman api */
    app.get('/brokerGet', authCheck, hasRole([1, 2]), /*middleware(brokerSearchAdminValidate),*/ brokerGet);
    app.get('/brokerFilterAdmin', authCheck, middleware(brokerFilterAdminValidate), brokerFilterAdmin);

    /* developer get search and filter comman api */
    app.get('/developerSearchAdmin', authCheck, /*middleware(developerSearchAdminValidate),*/ hasRole([2]), developerSearchAdmin);
    app.post('/developerFilterAdmin', authCheck, hasRole([2]), middleware(developerFilterAdminValidate), developerFilterAdmin);

    /* project get search and filter comman api */
    app.get('/projectSearchAdmin', authCheck, hasRole([2]), /*middleware(projectSearchAdminValidate),*/ projectSearchAdmin);
    app.post('/projectFilterAdmin', authCheck, middleware(projectFilterAdminValidate), projectFilterAdmin);

    /* state city locality get and search comman api */
    app.get('/stateSearch', authCheck, /**middleware(stateSearchValidate),*/ hasRole([1, 2]), stateSearch);
    app.get('/citySearch', authCheck, hasRole([1, 2]), /**middleware(stateSearchValidate),*/ citySearch);
    app.get('/localitySearch', authCheck, hasRole([1, 2]), /**middleware(stateSearchValidate),*/ localitySearch);
};