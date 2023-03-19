
const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

var multer = require("multer");
const upload = multer({ dest: "uploads/" });
const imageUpload = upload.fields([{ name: "profileImage", maxCount: 1 }]);
const {
  signup,
  verifyOtp,
  resendOtp,
  brokerDetail,
  editProfile,
  editProfessionalProfile,
  verifyProfile,
  verifyExpertiseProfile,
  postedByYou,
  getBrokerProfile,
  getBrokerAllReview,
  getBrokerAllfollowers,
  profileVerificationList,
  profileVerificationApprove,
  profileVerificationReject,
  flagPropertyRequestDelete,
  flagPropertyList,
  getBrokerAllCount,createContact,getContact,
  brokerLogout
} = require('./controller')

const { signupValidate, resendOtpValidate, brokerDetailValidate, editPersonalProfileValidate,
  editProfProfileValidate, verifyGenProfileValidate, verifyExpertiseProfileValidate, verifyOtpValidate,
  postedByYouVailidate, getBrokerProfilevailidate, brokerID, propertyID } = require('./vailidator')

module.exports = (app) => {

  app.post('/signup', middleware(signupValidate), signup);
  app.post('/verifyOtp', middleware(verifyOtpValidate), verifyOtp);
  app.post('/resendOtp', middleware(resendOtpValidate), resendOtp);
  app.post('/brokerDetail', authCheck, hasRole([1, 2]), middleware(brokerDetailValidate), brokerDetail);
  app.post('/editProfile', authCheck, hasRole([1, 2]), /*imageUpload,*/ middleware(editPersonalProfileValidate), editProfile);
  app.post('/editProfessionalProfile', authCheck, hasRole([1, 2]), middleware(editProfProfileValidate), editProfessionalProfile);
  app.post('/verifyProfile', authCheck, hasRole([1, 2]), middleware(verifyGenProfileValidate), verifyProfile);
  app.post('/verifyExpertiseProfile', authCheck, hasRole([1, 2]), middleware(verifyExpertiseProfileValidate), verifyExpertiseProfile);
  // app.get('/getProfile', authCheck, hasRole([1, 2]), middleware(getProfilevailidate), getProfile);
  app.get('/getBrokerProfile', authCheck, hasRole([1, 2]), middleware(getBrokerProfilevailidate), getBrokerProfile);
  app.get('/getBrokerAllCount', authCheck, hasRole([1, 2]), middleware(getBrokerProfilevailidate), getBrokerAllCount);
  app.get('/postedByYou', authCheck, hasRole([1, 2]), middleware(postedByYouVailidate), postedByYou);

  app.get('/getBrokerAllReview', authCheck, hasRole([1, 2]), getBrokerAllReview);
  app.get('/getBrokerAllfollowers', authCheck, hasRole([1, 2]), getBrokerAllfollowers);

  app.get('/profileVerificationList', authCheck, hasRole([2]), profileVerificationList);
  app.post('/profileVerificationApprove', authCheck, hasRole([2]), middleware(brokerID), profileVerificationApprove);
  app.post('/profileVerificationReject', authCheck, hasRole([2]), middleware(brokerID), profileVerificationReject);

  app.get('/flagPropertyList', authCheck, hasRole([2]), flagPropertyList);
  app.delete('/flagPropertyRequestDelete/:id', authCheck, hasRole([2]), middleware(propertyID), flagPropertyRequestDelete);
  app.get('/brokerLogout', authCheck, hasRole([1]), brokerLogout);

  app.post('/createContact',authCheck,hasRole([1,2]), createContact);

  app.get('/getContact',authCheck,hasRole([1,2]), getContact);

};