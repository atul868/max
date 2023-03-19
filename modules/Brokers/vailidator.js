const joi = require('joi');
exports.signupValidate = joi.object({
  mobile: joi.number().required(),
  forOtpAutofill:joi.string().optional(),
});

exports.verifyOtpValidate = joi.object({
  mobile: joi.number().required(),
  otp: joi.number().required()
});


exports.resendOtpValidate = joi.object({
  mobile: joi.number().required(),
  forOtpAutofill:joi.string().optional(),
});


exports.brokerDetailValidate = joi.object({
  // brokerId: joi.string().hex().length(24),
  dealIn: joi.array().items(joi.string()).required(),
  selector: joi.array().items(joi.string()).required(),
  specializationSubType: joi.array().items(joi.string()).required(),
  subCategory: joi.array().items(joi.string()).required(),
  // projectExperties: joi.string().required(),
  intrestState: joi.array().items(joi.string()).required(),
  interestCity: joi.array().items(joi.string()).required(),
  dealLocality: joi.array().items(joi.string()).required(),
  fullName: joi.string().required(),
  developerId: joi.array().items(joi.string()),
  projectId: joi.array().items(joi.string()),
  language: joi.array().items(joi.string()),
});

exports.editPersonalProfileValidate = joi.object({
  brokerId: joi.string().hex().length(24),
  dob: joi.string().optional(),
  email: joi.string().optional(),
  officeState: joi.string().optional(),
  officeCity: joi.string().optional(),
  fullName: joi.string().optional(),
  profileImage: joi.string().optional(),
  BusinessCard: joi.string().optional(),
  companyName: joi.string().optional(),
  dealIn: joi.array().items(joi.string()).optional(),
  selector: joi.array().items(joi.string()).optional(),
  specializationSubType: joi.array().items(joi.string()).optional(),
  intrestState: joi.array().items(joi.string()).optional(),
  interestCity: joi.array().items(joi.string()).optional(),
  dealLocality: joi.array().items(joi.string()).optional(),
  subCategory: joi.array().items(joi.string()).optional(),
  language: joi.array().items(joi.string()),
  developerId: joi.array().items(joi.string()).optional(),
  projectId: joi.array().items(joi.string()).optional(),
  gstNo: joi.string().max(16).min(16).optional(),
  reraNo: joi.string().optional(),
});


exports.editProfProfileValidate = joi.object({
  companyName: joi.string().required(),
  dealIn: joi.array().items(joi.string()).required(),
  selector: joi.array().items(joi.string()).required(),
  specializationSubType: joi.string().required(),
  intrestState: joi.array().items(joi.string()).required(),
  interestCity: joi.array().items(joi.string()).required(),
  dealLocality: joi.array().items(joi.string()).required(),
  subCategory: joi.array().items(joi.string()).required(),
  language: joi.array().items(joi.string()),
  projectExperties: joi.string().required(),
});


exports.verifyGenProfileValidate = joi.object({
  dealIn: joi.array().items(joi.string()).required(),
  selector: joi.array().items(joi.string()).required(),
  specializationSubType: joi.array().items(joi.string()).required(),
  intrestState: joi.array().items(joi.string()).required(),
  interestCity: joi.array().items(joi.string()).required(),
  dealLocality: joi.array().items(joi.string()).required(),
  fullName: joi.string().required(),
  email: joi.string().required().email(),
  companyName: joi.string().required(),
  gstNo: joi.string().max(16).min(16).required(),
  reraNo: joi.string().required(),
  officeCity: joi.string().required(),
  officeState: joi.string().required(),
  officeLocality: joi.string().required(),
  // officeBuilding: joi.string().required(),
  // language: joi.array().items(joi.string()).optional(),
  profileImage: joi.string().optional(),
  uploadBusinessCard: joi.string().required(),
});

exports.verifyExpertiseProfileValidate = joi.object({
  fullName: joi.string().required(),
  email: joi.string().required().email(),
  companyName: joi.string().required(),
  gstNo: joi.string().max(16).min(16).required(),
  reraNo: joi.string().required(),
  officeCity: joi.string().required(),
  officeState: joi.string().required(),
  officeLocality: joi.string().required(),
  // officeBuilding: joi.string().required(),
  language: joi.array().items(joi.string()),
  profileImage: joi.string().optional(),
  uploadBusinessCard: joi.string().required(),
});

exports.postedByYouVailidate = joi.object({
  _id: joi.string().hex().length(24).optional(),
  brokerId: joi.string().hex().length(24).optional(),
  page: joi.number().required().optional(),
  limit: joi.number().required().optional(),
});

// exports.getProfilevailidate = joi.object({
//   _id: joi.string().hex().length(24),
// });

exports.getBrokerProfilevailidate = joi.object({
  _id: joi.string().hex().length(24).optional(),
  brokerId: joi.string().hex().length(24).optional(),
});

exports.brokerID = joi.object({
  brokerId: joi.string().hex().length(24),
});

exports.propertyID = joi.object({
  propertyId: joi.string().hex().length(24),
});





