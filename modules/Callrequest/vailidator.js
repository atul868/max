const joi = require('joi');
exports.getCallReqValidate = joi.object({
    propertyId:joi.string().hex().length(24),
    requestFor:joi.string().hex().length(24)
});

exports.deletecallReqValidate = joi.object({
    id:joi.string().hex().length(24)
});