const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const multer = require("multer");
const authCheck = auth.jwt;

const { createProperty, showAllProperty, addPropertyAsHotDeal, showHotDealProperty, searchApartment, addPropertyAsPrimeListing,
  showAllPrimeListingProperty, searchTopBroker, editProperty, deleteProperty, showNewsFeedProperty, showTopBroker, filterProperty,
  filterBroker, getBrokerPropertyDetails, showAllPropertyDetail, showBroker, searchBroker,
  searchPropertyLocation, developerAndPropertyFilter, showNewsFeedReport, newsFeedReport,removePropertyFromHotDeal,propertyImageFlag } = require('./controller')

const upload = multer({ dest: "uploads/" });
const imageUpload = upload.fields([{ name: "image", maxCount: 10 }]);

const { CreateProperty, addPropertyInHotDeal, apartmentValidate, addPimeListingDataValidate,
  filterPropertyValidate, filterBrokerValidate, apartmenSearchtValidate, searchBrokerValidate,
  updateProperty, searchbrokerValidate,PropertyImageFlag } = require('./vailidator')



module.exports = (app) => {

  app.post('/property/create', imageUpload, authCheck, hasRole([1, 2]), middleware(CreateProperty), createProperty);

  app.get('/property/get', authCheck, hasRole([1, 2]), showAllProperty);

  app.put('/addPropertyInHotDeal', authCheck, middleware(addPropertyInHotDeal), hasRole([2]), addPropertyAsHotDeal);
  
  app.put('/removePropertyFromHotDeal', authCheck, middleware(addPropertyInHotDeal), hasRole([2]), removePropertyFromHotDeal);

  app.get('/showHotDealProperty', authCheck, hasRole([1, 2]), showHotDealProperty);

  app.post('/searchApartment', authCheck, middleware(apartmenSearchtValidate), hasRole([1, 2]), searchApartment);

  app.get('/searchPropertyLocation', authCheck, middleware(apartmentValidate), hasRole([1, 2]), searchPropertyLocation);

  app.get('/showAllPropertyDetail', authCheck, hasRole([1, 2]), showAllPropertyDetail);

  app.post('/searchTopBroker', authCheck, hasRole([1, 2]), middleware(searchbrokerValidate), searchTopBroker);

  app.get('/searchBrokerLocation', authCheck, hasRole([1, 2]), middleware(searchBrokerValidate), searchBroker);

  app.post('/showTopBroker', authCheck, showTopBroker);//common

  app.get('/showBroker', authCheck, hasRole([2]), showBroker);

  app.post('/filterProperty', authCheck, hasRole([1, 2]), middleware(filterPropertyValidate), filterProperty);

  app.post('/filterBroker', authCheck, middleware(filterBrokerValidate), filterBroker);

  app.post('/addPropertyAsPrimeListing', authCheck, hasRole([2]), middleware(addPimeListingDataValidate), addPropertyAsPrimeListing);////done

  app.post('/showAllPrimeListingProperty', authCheck, hasRole([1, 2]), showAllPrimeListingProperty);

  // app.post('/newsFeedReport', authCheck, middleware(reportValidate), newsFeedReport);

  // app.get('/showNewsFeedReport', authCheck, showNewsFeedReport);

  app.put('/property/edit', authCheck, hasRole([1, 2]), middleware(updateProperty), editProperty);

  app.put('/propertyImageFlag', authCheck, hasRole([2]), middleware(PropertyImageFlag), propertyImageFlag);

  app.delete('/property/delete/:_id', authCheck, hasRole([1, 2]), deleteProperty);

  app.post('/showNewsFeedProperty', authCheck,hasRole([1]), showNewsFeedProperty);

  app.get('/getBrokerPropertyDetails', authCheck, hasRole([1, 2]), getBrokerPropertyDetails);

  app.get('/developerAndPropertyFilter', authCheck, hasRole([1, 2]), developerAndPropertyFilter);
};

