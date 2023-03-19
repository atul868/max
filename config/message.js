/* SERVER RESPONSE MESSAGE */
exports.serverResponseMessage = {
  /* Notes Creation */
  MobileAlreadyExist: 'Mobile Aleready Exist!',
  RegisterSuccess: 'Register Successfully, Please check your otp',
  brokerNotExist: 'Broker not exist!',
  IncorrectOtp: 'Inncorect otp!',
  loginSuccess: 'Login Successfully',
  otpResend: 'otp resend successfully',
  updateSucessfully: 'data update Successfully',
  otpsend: 'Please check your otp for login',
  verifySuccessfully: 'Your Profile Verify Sucessfully',
  verifyVerificationRequest: 'Your Profile Verify Requested Sucessfully',

  ratingError: 'Rating only Between 1 to 5',
  deleteSucessfully: 'data delete sucessfully',
  deleteErrorFollow: 'data not delete please check brokerId and unfollowBrokerId !',
  deleteErrorCall: 'data not delete please check brokerId and requestedBrokerId !',
  deleteErrorSaveProperty: 'data not delete please check brokerId and propertyId !',
  soldSuccess: 'property mark as sold successfully',
  flagSuccess: 'property mark as flag successfully',
  propertyNotExist: 'property not exist !',
  propertyExist: 'property already exist !',
  helpDataNeeded: 'title and description needed',
  dataNotExist: 'data not found',
  mobileNumber: 'Mobile number should be 10 digit only',
  DROP_DOWN_DATA:'Dropdown value Fatched Succesfully',
  DROP_DOWN_DATA_ERROR:'Unable to Get Dropdown value',

  /* Create, Read, Search Message */
  PROPERTY_CREATED: 'property Created Succesfully',
  PROPERTY_READ: 'property Fatched Succesfully',
  HOTDEAL_PROPERTY_CREATED: 'Hot Deal property Created Succesfully',
  HOTDEAL_PROPERTY_READ: 'Hot Deal property Fatched Succesfully',
  HOTDEAL_PROPERTY_DELETED: 'Hot Deal property Removed Succesfully',
  HOTDEAL_PROPERTY_W: 'Unable to remove Hot Deal property',
  NEWS_FEED_REPORT_CREATED: 'News Feed Report Created Succesfully',
  NEWS_FEED_REPORT_READ: 'News Feed Report  Fatched Succesfully',
  PROPERTY_BOOKMARKED: 'Bookmark property Created Succesfully',
  BOOKMARK_PROPERTY_READ: 'Bookmark Property Fatched Succesfully',
  TOP_BROKER_READ: 'Broker Fatched Succesfully',
  FAILURE_TOP_BROKER_READ: 'Unable to Get broker',
  PRIME_PROPERTY_CREATED: 'Prime Listing property Created Succesfully',
  PRIME_PROPERTY_READ: 'Prime Listing property Fatched Succesfully',
  PROPERTY_DELETE: 'property deleted Succesfully',
  PROPERTY_DOES_NOT_EXISTS: 'property Does Not Exists',
  HOTDEAL_OR_PRIME:'this property already added in hotdeal or prime listing',
  HOTDEAL:'this property already added in hotdeal listing',

  CONTACT_CREATED: 'Contact Created Succesfully',
  CONTACT_READ: 'Contact Fatched Succesfully',
  FAILURE_CONTACT_CREATE: 'Unable to Create contacts',
  FAILURE_CONTACT_READ: 'Unable to Get contacts',

  /* Failure Message*/
  FAILURE_HOTDEAL_PROPERTY_CREATE: 'Unable to Create Hot Deal property',
  FAILURE_HOTDEAL_PROPERTY_READ: 'Unable to Get Hot Deal property',
  FAILURE_PRIME_PROPERTY_CREATE: 'Unable to Create Prime property',
  FAILURE_PRIME_PROPERTY_READ: 'Unable to Get Prime property',
  FAILURE_PROPERTY_CREATE: 'Unable to Create property',//CONTACT
  FAILURE_NEWS_FEED_REPORT_CREATED: 'Unable to Create News Feed Report ',
  FAILURE_NEWS_FEED_REPORT_READ: 'Unable to Featch Bookmark property',
  FAILURE_PROPERTY_READ: 'Unable to Get property',
  FAILURE_PROPERTY_BOOKMARK: 'Unable to Create Bookmark property',
  FAILURE_PROPERTY_BOOKMARK_READ: 'Unable to Featch Bookmark property',


  /* Catch Error */
  unauthorized_module: "You do not authorization for accessing this module.",
  DATA_CREATED: 'Data Created Succesfully',
  DATA_UPDATE: 'Data Updated Succesfully',
  DATA_DELETE: 'Data Deleted Succesfully',
  DATA_READ: 'Data Fatched Succesfully',
  DATA_READ_ERROR: 'Data not Fatched',
  FAILURE_DATA_CREATE: 'Unable to Create Data',
  FAILURE_DATA_UPDATE: 'Unable to Update Data',
  FAILURE_DATA_DELETE: 'Unable to Delete Data',
  FAILURE_DATA_READ: 'Unable to Get Data',
  ACTION_COMPLETE: 'ACTION COMPLETED',
  ACTION_INCOMPLETE: 'ACTION INCOMPLETED',
  CASCADENING_DELETE_COMPLETE: 'CasCading Delete Done',
  /* Catch Error */
  DATA_EXISTS: 'Data Already Exists',
  DATA_DOES_NOT_EXISTS: 'Data Does Not Exists',
  DATA_DOES_CANOTNOT_DELETE: 'Data Can  Not Delete or Something went Wrong!',
  SUPER_BROKER: 'Super Assigned  Succesfully',
  SUPER_BROKER_W: 'broker is already super broker or unverified',

  /*locality message*/
  LOCALITY_CREATED: 'locality Created Succesfully',
  LOCALITY_UPDATE: 'locality Updated Succesfully',
  LOCALITY_DELETE: 'locality Deleted Succesfully',
  LOCALITY_READ: 'locality Fatched Succesfully',
  LOCALITY_READ_ERROR: 'locality not Fatched',
  FAILURE_LOCALITY_CREATE: 'Unable to Create locality',
  FAILURE_LOCALITY_UPDATE: 'Unable to Update locality',
  FAILURE_LOCALITY_DELETE: 'Unable to Delete locality',
  FAILURE_LOCALITY_READ: 'Unable to Get locality',
  LOCALITY_EXISTS: 'locality Already Exists',
  LOCALITY_DOES_NOT_EXISTS: 'locality Does Not Exists',

  /*property developer message*/
  PROPERTY_DEVELOPER_CREATED: 'property developer Created Succesfully',
  PROPERTY_DEVELOPER_UPDATE: 'property developer Updated Succesfully',
  PROPERTY_DEVELOPER_DELETE: 'property developer Deleted Succesfully',
  PROPERTY_DEVELOPER_READ: 'property developer Fatched Succesfully',
  PROPERTY_DEVELOPER_READ_ERROR: 'property developer not Fatched',
  FAILURE_PROPERTY_DEVELOPER_CREATE: 'Unable to Create property developer',
  FAILURE_PROPERTY_DEVELOPER_UPDATE: 'Unable to Update property developer',
  FAILURE_PROPERTY_DEVELOPER_DELETE: 'Unable to Delete property developer',
  FAILURE_PROPERTY_DEVELOPER_READ: 'Unable to Get property developer',
  PROPERTY_DEVELOPER_EXISTS: 'property developer Already Exists',
  PROPERTY_DEVELOPER_DOES_NOT_EXISTS: 'property developer Does Not Exists',

  PROJECT_DEVELOPER_READ: 'project and developer Fatched Succesfully',
  PROJECT_DEVELOPER_READ_ERROR: 'project and developer not Fatched',

  /*property project message*/
  PROPERTY_PROJECT_CREATED: 'property project Created Succesfully',
  PROPERTY_PROJECT_UPDATE: 'property project Updated Succesfully',
  PROPERTY_PROJECT_DELETE: 'property project Deleted Succesfully',
  PROPERTY_PROJECT_READ: 'property project Fatched Succesfully',
  PROPERTY_PROJECT_READ_ERROR: 'property project not Fatched',
  FAILURE_PROPERTY_PROJECT_CREATE: 'Unable to Create property project',
  FAILURE_PROPERTY_PROJECT_UPDATE: 'Unable to Update property project',
  FAILURE_PROPERTY_PROJECT_DELETE: 'Unable to Delete property project',
  FAILURE_PROPERTY_PROJECT_READ: 'Unable to Get property project',
  PROPERTY_PROJECT_EXISTS: 'property project Already Exists',
  PROPERTY_PROJECT_DOES_NOT_EXISTS: 'property project Does Not Exists',

  STATE_READ: 'state Fatched Succesfully',
  FAILURE_STATE_READ: 'Unable to Get state',

  CITY_READ: 'city Fatched Succesfully',
  FAILURE_CITY_READ: 'Unable to Get city',

  ADMIN_LOGIN: 'Login Succesfully',
  ADMIN_LOGIN_FAILURE: 'incorrect username and password',
  ADMIN_DOES_NOT_EXISTS: 'Admin Does Not Exists',
  PASSWORD_INCORRECT: 'Password entered is Incorrect',
  ADMIN_LOGOUT: 'Logout Succesfully',
  ADMIN_ALERT: 'First you need to login',

  PROFILE_VERIFICATION_SUCCESS: 'Profile verify Succesfully',
  PROFILE_VERIFICATION_ERROR: 'Profile Not verify',
  PROFILE_VERIFICATION_REJECT_SUCCESS: 'Profile verification reject',
  PROFILE_VERIFICATION_REJECT_ERROR: 'Profile verification not reject',






};
