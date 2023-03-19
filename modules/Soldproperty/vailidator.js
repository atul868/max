const joi = require('joi');
exports.addSoldPropertyVailidate = joi.object({
    propertyId:joi.string().hex().length(24)
});