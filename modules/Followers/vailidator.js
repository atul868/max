const joi = require('joi');
exports.addFollowVailidate = joi.object({
    // propertyId:joi.string().hex().length(24),
    followFor:joi.string().hex().length(24)
});

exports.deleteFollowVailidate = joi.object({
    unfollowBrokerId:joi.string().hex().length(24)
});

