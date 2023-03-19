const joi = require('joi');
exports.addFlagVailidate = joi.object({
    propertyId:joi.string().hex().length(24),
});

