const joi = require('joi');
exports.createPropertyDeveloperValidate = joi.object({
  developeName: joi.string().required(),
  developeLogo: joi.string().allow('').optional(),
  developeHeadquaterLocation: joi.object({
    state: joi.string().required(),
    city: joi.string().required(),
    locality: joi.string().required(),
    apartment: joi.string().optional()
  }),
});

exports.updatePropertyDeveloperValidate = joi.object({
  id: joi.string().hex().length(24),
  developeName: joi.string().optional(),
  developeLogo: joi.string().allow('').optional(),
  developeHeadquaterLocation: joi.object({
    state: joi.string().optional(),
    city: joi.string().optional(),
    locality: joi.string().optional(),
    // apartment: joi.string().optional()
  }),
});

exports.createPropertyProjectValidate = joi.object({
  developerId: joi.string().hex().length(24),
  projectName: joi.string().required(),
  projectType: joi.string().optional(),
  projectLogo: joi.string().allow('').optional(),
  projectLocation: joi.object({
    state: joi.string().required(),
    city: joi.string().required(),
    locality: joi.string().required(),
    // apartment: joi.string().optional()
  }),
  projectGeoLocation: joi.object({
    latitude: joi.string().optional(),
    longitude: joi.string().optional()
  }),
  projectReraNumber: joi.string().optional(),
  projectContactPerson: joi.string().optional(),
  projectContactPersonNumber: joi.number().optional(),
  projectmaintenace: joi.string().optional(),
  levidByRwaTenantRent: joi.string().optional(),
  levidByRwaSaleUnit: joi.string().optional()
});

exports.updatePropertyProjectValidate = joi.object({
  id: joi.string().hex().length(24),
  developerId: joi.string().hex().length(24),
  projectName: joi.string().optional(),
  projectType: joi.string().optional(),
  projectLogo: joi.string().allow('').optional(),
  projectLocation: joi.object({
    state: joi.string().optional(),
    city: joi.string().optional(),
    locality: joi.string().optional(),
    // apartment: joi.string().optional()
  }),
  projectGeoLocation: joi.object({
    latitude: joi.string().optional(),
    longitude: joi.string().optional()
  }),
  projectReraNumber: joi.string().optional(),
  projectContactPerson: joi.string().optional(),
  projectContactPersonNumber: joi.number().optional(),
  projectmaintenace: joi.string().optional(),
  levidByRwaTenantRent: joi.string().optional(),
  levidByRwaSaleUnit: joi.string().optional()
});

exports.propertySearchAdminValidate = joi.object({
  allProperty: joi.boolean().optional(),
  hotDeal: joi.boolean().optional(),
  exclusive: joi.boolean().optional(),
  searchValue: joi.string().optional(),
  propertyType: joi.string().optional(),
  isSearch: joi.boolean().optional(),
  isFilter: joi.boolean().optional(),
  property: joi.string().optional(),
  state: joi.string().optional(),
  city: joi.string().optional(),
  locality: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.brokerSearchAdminValidate = joi.object({
  brokerType: joi.string().optional(),
  searchValue: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.propertyFilterAdminValidate = joi.object({
  property: joi.string().optional(),
  state: joi.string().optional(),
  city: joi.string().optional(),
  locality: joi.string().optional(),
  propertyType: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.brokerFilterAdminValidate = joi.object({
  brokerType: joi.string().optional(),
  interestCity: joi.string().optional(),
  dealLocality: joi.string().optional(),
  intrestState: joi.string().optional(),
  projectSpecilization: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.developerSearchAdminValidate = joi.object({
  searchValue: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.developerFilterAdminValidate = joi.object({
  propertyMin: joi.number().optional(),
  propertyMax: joi.number().optional(),
  state: joi.string().optional(),
  city: joi.string().optional(),
  locality: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.projectSearchAdminValidate = joi.object({
  searchValue: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.projectFilterAdminValidate = joi.object({
  projectType: joi.string().optional(),
  city: joi.string().optional(),
  state: joi.string().optional(),
  locality: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.stateSearchValidate = joi.object({
  searchValue: joi.string().optional(),
  state_id: joi.array().optional(),
  city_id: joi.array().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});