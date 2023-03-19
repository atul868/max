const joi = require('joi');
exports.createLocalityValidate = joi.object({
  stateId:joi.number().required(),
  cityId:joi.number().required(),
  Name: joi.string().required(),
});

exports.updateLocalityValidate = joi.object({
  id: joi.string().hex().length(24),
  stateId:joi.number().optional(),
  cityId:joi.number().optional(),
  Name: joi.string().optional(),
});