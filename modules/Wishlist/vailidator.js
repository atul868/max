const joi = require('joi');
exports.propertyBookMarkValidate = joi.object({
    propertyId: joi.string().hex().length(24),
    brokerId: joi.string().hex().length(24),
  });
  