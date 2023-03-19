const joi = require('joi');
exports.addReviewVailidate = joi.object({
     rating:joi.number().required(),
    review:joi.string().required(),
    propertyId:joi.string().hex().length(24),
    reviewFor:joi.string().hex().length(24)
});