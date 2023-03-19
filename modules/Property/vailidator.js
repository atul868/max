const joi = require('joi');
exports.CreateProperty = joi.object({
  // brokerId: joi.string().hex().length(24),
  propertyProjectId: joi.string().hex().length(24),
  propertyDeveloperId: joi.string().hex().length(24),
  propertyImage: joi.array().items({
    propertyImage: joi.string().optional(),
    verifiedflag: joi.boolean().optional(),
  }),
  propertyNature: joi.string().optional(),
  chooseCategory: joi.string().optional(),
  commission: joi.string().optional(),
  //commission:Joi.number().min(0).max(100).integer(),
  projectName: joi.string().optional(),
  developerName: joi.string().optional(),
  propertyLocalityAddress: joi.string().optional(),
  propertyStateAddress: joi.string().optional(),
  propertyCityAddress: joi.string().optional(),
  propertyType: joi.string().optional(),
  unitType: joi.string().optional(),
  plotAreaVal: joi.number().optional(),
  groundFloorProperty: joi.boolean().optional(),
  constructedAreaVal: joi.number().optional(),
  constructedAreaUnit: joi.string().lowercase().optional(),
  plotAreaUnit: joi.string().lowercase().optional(),
  // totalFloor: joi.number().optional(),
  floorNo: joi.number().optional(),
  topFloorProperty: joi.boolean().optional(),
  apartmentFurnishing: joi.string().optional(),
  facingType: joi.string().optional(),
  ownershipType: joi.string().optional(),
  facingDirection: joi.string().optional(),
  stageOfConstruction: joi.string().optional(),
  uspDescription: joi.object({
    usp1: joi.string().optional(),
    usp2: joi.string().optional(),
    usp3: joi.string().optional()
  }),
  additionalFacilities: joi.array().optional(),
  description: joi.string().optional(),
  distressSale: joi.boolean().optional(),
  price: joi.number().required(),
  otherCharge: joi.number().optional(),
  negotiable: joi.boolean().optional(),
  pdf: joi.string().optional(),
  pdfFileName: joi.string().optional(),
  status: joi.string().optional(),
  sizes: joi.array().items(joi.string()).optional(),
  listingTillDate: joi.date(),
  propertyAsPrimeListing: joi.boolean().optional(),
  frontUnit: joi.string().optional(),
  frontAreaVal: joi.number().optional(),
  depthUnit: joi.string().optional(),
  depthAreaVal: joi.number().optional(),
  roadInFront: joi.string().optional(),
  roadInFrontVal: joi.number().optional(),
  cornerPloat: joi.boolean().optional(),
  propertyAge: joi.string().optional(),
  leasedTo: joi.array().items(joi.string()),
  brand: joi.array().items(joi.string()).optional(),
  parkingFacilities: joi.string().optional(),
  totalFloorBuilt: joi.number().optional(),
  directOwnerTouch: joi.boolean().optional(),
  vancatPreleased: joi.string().optional(),
  groundCoverage: joi.string().optional(),
  propertyOnFloor: joi.string().optional(),
  heightVal: joi.number().optional(),
  heightUnit: joi.string().optional(),
  propertyManagedBy: joi.string().optional(),
  totalConstructedFloorInProperty: joi.number().optional(),
  maintenaceExtra: joi.boolean().optional(),
  GivenTo: joi.array().items(joi.string()).optional(),
  space: joi.string().optional(),
  Occupancy: joi.string().optional(),
});

exports.updateProperty = joi.object({
  _id: joi.string().hex().length(24),
  propertyProjectId: joi.string().hex().length(24),
  propertyDeveloperId: joi.string().hex().length(24),
  projectName: joi.string().optional(),
  developerName: joi.string().optional(),
  propertyImage: joi.array().items({
    propertyImage: joi.string().optional(),
    verifiedflag: joi.boolean().optional(),
  }),
  propertyNature: joi.string().optional(),
  chooseCategory: joi.string().optional(),
  commission: joi.string().optional(),
  propertyLocalityAddress: joi.string().optional(),
  propertyStateAddress: joi.string().optional(),
  propertyCityAddress: joi.string().optional(),
  propertyType: joi.string().optional(),
  unitType: joi.string().optional(),
  plotAreaVal: joi.number().optional(),
  groundFloorProperty: joi.boolean().optional(),
  constructedAreaVal: joi.number().optional(),
  constructedAreaUnit: joi.string().lowercase().optional(),
  plotAreaUnit: joi.string().lowercase().optional(),
  // totalFloor: joi.number().optional(),
  floorNo: joi.number().optional(),
  topFloorProperty: joi.boolean().optional(),
  apartmentFurnishing: joi.string().optional(),
  facingType: joi.string().optional(),
  ownershipType: joi.string().optional(),
  facingDirection: joi.string().optional(),
  stageOfConstruction: joi.string().optional(),
  uspDescription: joi.object({
    usp1: joi.string().optional(),
    usp2: joi.string().optional(),
    usp3: joi.string().optional()
  }),
  additionalFacilities: joi.array().optional(),
  description: joi.string().optional(),
  distressSale: joi.boolean().optional(),
  price: joi.number().optional(),
  otherCharge: joi.number().optional(),
  negotiable: joi.boolean().optional(),
  pdf: joi.string().optional(),
  pdfFileName: joi.string().optional(),
  status: joi.string().optional(),
  sizes: joi.array().items(joi.string()).optional(),
  listingTillDate: joi.date(),
  propertyAsPrimeListing: joi.boolean().optional(),
  frontUnit: joi.string().optional(),
  frontAreaVal: joi.number().optional(),
  depthUnit: joi.string().optional(),
  depthAreaVal: joi.number().optional(),
  roadInFront: joi.string().optional(),
  roadInFrontVal: joi.number().optional(),
  cornerPloat: joi.boolean().optional(),
  propertyAge: joi.string().optional(),
  leasedTo: joi.array().items(joi.string()).optional(),
  brand: joi.array().items(joi.string()).optional(),
  parkingFacilities: joi.string().optional(),
  totalFloorBuilt: joi.number().optional(),
  directOwnerTouch: joi.boolean().optional(),
  vancatPreleased: joi.string().optional(),
  groundCoverage: joi.string().optional(),
  propertyOnFloor: joi.string().optional(),
  heightVal: joi.number().optional(),
  heightUnit: joi.string().optional(),
  propertyManagedBy: joi.string().optional(),
  totalConstructedFloorInProperty: joi.number().optional(),
  maintenaceExtra: joi.boolean().optional(),
  GivenTo: joi.array().items(joi.string()).optional(),
  space: joi.string().optional(),
  Occupancy: joi.string().optional(),
});



exports.showProperty = joi.object({
  brokerId: joi.string().hex().length(24),
  page: joi.number().optional(),
  limit: joi.number().optional()
});


exports.addPropertyInHotDeal = joi.object({
  _id: joi.string().hex().length(24),
});

exports.apartmentValidate = joi.object({

  locality: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional()
});

exports.apartmenSearchtValidate = joi.object({
  propertyStateAddress: joi.array().items(joi.string()).optional(),
  propertyCityAddress: joi.array().items(joi.string()).optional(),
  propertyLocalityAddress: joi.array().items(joi.string()).optional(),
  projectSpecilization: joi.array().items(joi.string()).optional(),
  propertyType: joi.array().items(joi.string()).optional(),
  distressSale: joi.boolean().optional(),
  stageOfConstruction: joi.array().items(joi.string()).optional(),
  area_min: joi.number().optional(),
  plotAreaUnit: joi.string().optional(),
  area_max: joi.number().optional(),
  price_min: joi.number().optional(),
  price_max: joi.number().optional(),
  floor: joi.number().optional(),
  facingType: joi.array().items(joi.string()).optional(),
  apartmentFurnishing: joi.array().items(joi.string()).optional(),
  facingDirection: joi.array().items(joi.string()).optional(),
  developer: joi.array().items(joi.string()).optional(),
  project: joi.array().items(joi.string()).optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});


exports.filterPropertyValidate = joi.object({
  projectSpecilization: joi.array().items(joi.string()).optional(),
  propertyType: joi.array().items(joi.string()).optional(),
  distressSale: joi.boolean().optional(),
  stageOfConstruction: joi.array().items(joi.string()).optional(),
  area_min: joi.number().optional(),
  plotAreaUnit: joi.string().optional(),
  area_max: joi.number().optional(),
  price_min: joi.number().optional(),
  price_max: joi.number().optional(),
  floor: joi.number().optional(),
  facingType: joi.array().items(joi.string()).optional(),
  apartmentFurnishing: joi.array().items(joi.string()).optional(),
  facingDirection: joi.array().items(joi.string()).optional(),
  developer: joi.array().items(joi.string()).optional(),
  project: joi.array().items(joi.string()).optional(),
  page: joi.number().optional(),
  limit: joi.number().optional()

});


exports.searchBrokerValidate = joi.object({
  searchValue: joi.string().optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});

exports.PropertyImageFlag = joi.object({
  _id: joi.string().hex().length(24)
});


exports.searchbrokerValidate = joi.object({
  brokerName: joi.string().optional(),
  intrestState: joi.array().items(joi.string()).optional(),
  interestCity: joi.array().items(joi.string()).optional(),
  dealLocality: joi.array().items(joi.string()).optional(),
  dealIn: joi.array().items(joi.string()).optional(),
  propertyNature: joi.array().items(joi.string()).optional(),
  specializationSubType: joi.array().items(joi.string()).optional(),
  developer: joi.array().items(joi.string()).optional(),
  project: joi.array().items(joi.string()).optional(),
  projectSpecilization: joi.array().items(joi.string()).optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});



exports.filterBrokerValidate = joi.object({
  intrestState: joi.string().optional(),
  interestCity: joi.string().optional(),
  dealLocality: joi.string().optional(),
  dealIn: joi.array().items(joi.string()).optional(),
  propertyNature: joi.array().items(joi.string()).optional(),
  specializationSubType: joi.array().items(joi.string()).optional(),
  projectSpecilization: joi.array().items(joi.string()).optional(),
  developer: joi.array().items(joi.string()).optional(),
  project: joi.array().items(joi.string()).optional(),
  page: joi.number().optional(),
  limit: joi.number().optional(),
});


exports.addPimeListingDataValidate = joi.object({
  _id: joi.string().hex().length(24),
});


exports.reportValidate = joi.object({
  propertyId: joi.string().hex().length(24),
  brokerId: joi.string().hex().length(24),
  report: joi.string().required(),
});



exports.propertyBookMarkValidate = joi.object({
  propertyId: joi.string().hex().length(24),
  brokerId: joi.string().hex().length(24)
});
