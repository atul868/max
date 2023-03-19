const { ObjectId } = require('mongoose').Types;
const { findOne } = require('../Brokers/schema');
const { propertyDeveloper, propertyproject } = require('./schema');
const broker = require('../Brokers/schema');
const { property } = require('../Property/schema');
const flag = require('../Flagproperty/schema');
const { state, city, locality } = require('../common/schema');
const { array } = require('joi');

/**
 * @author - atul singh chauhan
 * @createDeveloper - find Developer
 * @param {*} req 
 * @returns 
 */
module.exports.findDeveloper = async (req) => {
  return await propertyDeveloper.findOne(req);
}

/**
 * @author - atul singh chauhan
 * @createDeveloper - find Project
 * @param {*} req 
 * @returns 
 */
module.exports.findProject = async (req) => {
  return await propertyproject.findOne(req);
}

/**
 * @author - atul singh chauhan
 * @createDeveloper - create Developer
 * @param {*} req 
 * @returns 
 */
module.exports.createDeveloper = async (req) => {
  return await propertyDeveloper.create(req);
}
/**
* @author - atul singh chauhan
* @getDeveloper - get Developer
* @param {*} req 
* @returns 
*/
module.exports.getDeveloper = async () => {
  return await propertyDeveloper.find({}).lean();
}

/**
* @author - atul singh chauhan
* @showAllDeveloper - Show All Developer
* @param {*} req 
* @returns 
*/
module.exports.showAllDeveloper = async (id) => {

  return await propertyDeveloper.aggregate([
    {
      $match: { _id: ObjectId(id), isActive: true }
    },
    // {
    //   '$lookup': {
    //     'from': 'properties',
    //     'localField': '_id',
    //     'foreignField': 'propertyDeveloperId',
    //     'as': 'propertyData'
    //   }
    // }, {
    //   '$addFields': {
    //     'propertyCount': {
    //       '$size': '$propertyData'
    //     }
    //   }
    // }, {
    //   '$unwind': {
    //     'path': '$propertyData',
    //     'preserveNullAndEmptyArrays': false
    //   }
    // }, {
    //   '$project': {
    //     '_id': 1,
    //     'developeHeadquaterState': '$developeHeadquaterLocation.state',
    //     'developeHeadquaterLocation': '$developeHeadquaterLocation.city',
    //     'developeHeadquaterLocality': '$developeHeadquaterLocation.locality',
    //     'developeName': 1,
    //     'createdAt': 1,
    //     'propertyCount': 1,
    //     'developeLogo':1
    //   }
    // }, 
    {
      '$sort': {
        'developeName': 1
      }
    }
  ]
  );
}

/**
* @author - atul singh chauhan
* @showAllProject - Show All Project
* @param {*} req 
* @returns 
*/
module.exports.showAllProject = async (id) => {
  console.log(id);
  return await propertyproject.aggregate([
    {
      $match: { _id: ObjectId(id) }
    },
    {
      '$lookup': {
        'from': 'propertydevelopers',
        'localField': 'developerId',
        'foreignField': '_id',
        'as': 'projectData'
      }
    },
    {
      '$unwind': {
        'path': '$projectData',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$project': {
        '_id': 1,
        'projectName': 1,
        'developeName': '$projectData.developeName',
        'createdAt': 1,
        'projectType': 1,
        'projectState': '$projectLocation.state',
        'projectCity': '$projectLocation.city',
        'projectLocation': '$projectLocation.locality',
        // 'projectAprtment': '$projectLocation.apartment',
        'projectLogo': 1,
        'latitude': '$projectGeoLocation.latitude',
        'longitude': '$projectGeoLocation.longitude',
        'projectReraNumber': 1,
        'projectContactPerson': 1,
        'projectContactPersonNumber': 1,
        'projectmaintenace': 1,
        'levidByRwaTenantRent': 1,
        'levidByRwaSaleUnit': 1
      }
    }]
  );
}

/**
 * @author - atul singh chauhan
 * @updateDeveloper - update Developer
 * @param {*} req 
 * @returns 
 */
module.exports.updateDeveloper = async (req, developerData) => {
  developerData.developeName = req.developeName ? req.developeName : developerData.developeName;
  developerData.developeLogo = req.developeLogo ? req.developeLogo : developerData.developeLogo;
  developerData.developeHeadquaterLocation.state = req.developeHeadquaterLocation.state ? req.developeHeadquaterLocation.state : developerData.developeHeadquaterLocation.state;
  developerData.developeHeadquaterLocation.city = req.developeHeadquaterLocation.city ? req.developeHeadquaterLocation.city : developerData.developeHeadquaterLocation.city;
  developerData.developeHeadquaterLocation.locality = req.developeHeadquaterLocation.locality ? req.developeHeadquaterLocation.locality : developerData.developeHeadquaterLocation.locality;
  // developerData.developeHeadquaterLocation.apartment = req.developeHeadquaterLocation.apartment ? req.developeHeadquaterLocation.apartment : developerData.developeHeadquaterLocation.apartment;
  return await developerData.save();
}



/**
* @author - atul singh chauhan
* @deleteDeveloper - delete Developer
* @param {*} req 
* @returns 
*/

module.exports.deleteDeveloper = async (id) => {
  // return await propertyDeveloper.findByIdAndDelete({ _id: req.params.id });
  return await propertyDeveloper.findByIdAndUpdate(id, { isActive: false });
}
/**
* @author - atul singh chauhan
* @createDeveloper - create Developer
* @param {*} req 
* @returns 
*/

module.exports.createProject = async (req) => {
  return await propertyproject.create(req);
}

/**
* @author - atul singh chauhan
* @getDeveloper - get Developer
* @param {*} req 
* @returns 
*/

module.exports.getProject = async (req) => {
  return await propertyproject.find({ _id: ObjectId(req.query.id) }).lean();
}


/**
* @author - atul singh chauhan
* @updateDeveloper - update Developer
* @param {*} req 
* @returns 
*/

module.exports.updateProject = async (req, projectData) => {
  projectData.developerId = req.developerId ? req.developerId : projectData.developerId;
  projectData.projectName = req.projectName ? req.projectName : projectData.companyName;
  projectData.projectLogo = req.projectLogo ? req.projectLogo : projectData.projectLogo;
  projectData.projectType = req.projectType ? req.projectType : projectData.projectType;
  projectData.projectReraNumber = req.projectReraNumber ? req.projectReraNumber : projectData.projectReraNumber;
  projectData.projectContactPerson = req.projectContactPerson ? req.projectContactPerson : projectData.projectContactPerson;
  projectData.projectContactPersonNumber = req.projectContactPersonNumber ? req.projectContactPersonNumber : projectData.projectContactPersonNumber;
  projectData.projectmaintenace = req.projectmaintenace ? req.projectmaintenace : projectData.projectmaintenace;
  projectData.levidByRwaTenantRent = req.levidByRwaTenantRent ? req.levidByRwaTenantRent : projectData.levidByRwaTenantRent;
  projectData.levidByRwaSaleUnit = req.levidByRwaSaleUnit ? req.levidByRwaSaleUnit : projectData.levidByRwaSaleUnit;
  projectData.projectLocation.state = req.projectLocation.state ? req.projectLocation.state : projectData.projectLocation.state;
  projectData.projectLocation.city = req.projectLocation.city ? req.projectLocation.city : projectData.projectLocation.city;
  projectData.projectLocation.locality = req.projectLocation.locality ? req.projectLocation.locality : projectData.projectLocation.locality;
  // projectData.projectLocation.apartment = req.projectLocation.apartment ? req.projectLocation.apartment : projectData.projectLocation.apartment;
  projectData.projectGeoLocation.latitude = req.projectGeoLocation.latitude ? req.projectGeoLocation.latitude : projectData.projectGeoLocation.latitude;
  projectData.projectGeoLocation.longitude = req.projectGeoLocation.longitude ? req.projectGeoLocation.longitude : projectData.projectGeoLocation.longitude;
  return await projectData.save();
}

module.exports.deleteProject = async (id) => {
  return await propertyproject.findByIdAndUpdate(id, { isActive: false });
}

module.exports.superBrokerAssign = async (req) => {
  return await req.save();
}

module.exports.propertySearch = async (req, limit, page) => {

  var page = limit * page;
  let whereArr = {};
  const { searchValue } = req.body;

  if (req.body.allProperty == true) {
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
    whereArr['isSold'] = false;
  }
  else if (req.body.hotDeal == true) {
    whereArr['propertyAsHotDeal'] = true;
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
  }
  else if (req.body.exclusive == true) {
    whereArr['propertyAsPrimeListing'] = true;
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
  }

  const res = await property.aggregate([
    {
      '$match': whereArr
    },
    {
      '$lookup': {
        'from': 'brokers',
        'localField': 'brokerId',
        'foreignField': '_id',
        'as': 'brokerData'
      }
    }, {
      '$unwind': {
        'path': '$brokerData',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$lookup': {
        'from': 'follows',
        'localField': 'brokerId',
        'foreignField': 'followFor',
        'as': 'followData'
      }
    }, {
      '$addFields': {
        'followerCount': {
          '$size': '$followData'
        }
      }
    },
    {
      '$project': {
        '_id': 1,
        'propertyStateAddress': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'createdAt': 1,
        'brokerName': '$brokerData.fullName',
        'propertyType': 1,
        'propertyAsHotDeal': 1,
        'propertyAsPrimeListing': 1,
        'isActive': 1,
        'isSold': 1,
      }
    },
    {
      '$match': {
        '$or': [
          {
            intrestState: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
          {
            dealLocality: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
          {
            interestCity: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
          {
            brokerName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          }
        ]
      }
    },
    {
      '$sort': { '_id': -1 }
    },
    { '$skip': page },
    { '$limit': limit },
  ]
  );
  return res;
}

module.exports.propertyFilter = async (req, limit, page) => {

  var page = limit * page;
  let whereArr = {};
  const { state, city, locality, propertyType } = req.query;
  if (req.query.allProperty) {
    state && (whereArr['propertyStateAddress'] = state);
    city && (whereArr['propertyCityAddress'] = city);
    locality && (whereArr['propertyLocalityAddress'] = locality);
    propertyType && (whereArr['propertyType'] = propertyType);
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
  }
  else if (req.query.hotDeal) {
    state && (whereArr['propertyStateAddress'] = state);
    city && (whereArr['propertyCityAddress'] = city);
    locality && (whereArr['propertyLocalityAddress'] = locality);
    propertyType && (whereArr['propertyType'] = propertyType);
    whereArr['propertyAsHotDeal'] = true;
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
  }
  else if (req.query.exclusive) {
    state && (whereArr['propertyStateAddress'] = state);
    city && (whereArr['propertyCityAddress'] = city);
    locality && (whereArr['propertyLocalityAddress'] = locality);
    propertyType && (whereArr['propertyType'] = propertyType);
    whereArr['propertyAsPrimeListing'] = true;
    whereArr['isActive'] = true;
    whereArr['isSold'] = false;
  }

  const res = await property.aggregate([
    {
      '$lookup': {
        'from': 'brokers',
        'localField': 'brokerId',
        'foreignField': '_id',
        'as': 'brokerData'
      }
    }, {
      '$unwind': {
        'path': '$brokerData',
        'preserveNullAndEmptyArrays': false
      }
    }, {
      '$lookup': {
        'from': 'follows',
        'localField': 'brokerId',
        'foreignField': 'followFor',
        'as': 'followData'
      }
    }, {
      '$addFields': {
        'followerCount': {
          '$size': '$followData'
        }
      }
    },
    {
      '$project': {
        '_id': 1,
        'propertyStateAddress': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'createdAt': 1,
        'brokerName': '$brokerData.fullName',
        'propertyType': 1,
        'propertyAsHotDeal': 1,
        'propertyAsPrimeListing': 1,
        'isActive': 1,
        'isSold': 1,
      }
    },
    {
      '$match': whereArr
    },
    // {
    //   '$match': {
    //     '$or': [newObj]
    //   }
    // },
    {
      '$sort': { '_id': -1 }
    },
    { '$skip': page },
    { '$limit': limit },
  ]
  );
  return res;
}

module.exports.adminpropertyFilter = async (req, limit, page) => {
  try {
    if (req.user.group == 2) {
      var page = limit * page;
      const { searchValue, city, state, locality, propertyType, typeOfProperty } = req.query;
      let whereArr = {};

      var aggregateQuery = [
        {
          '$lookup': {
            'from': 'brokers',
            'localField': 'brokerId',
            'foreignField': '_id',
            'as': 'brokerData'
          }
        }, {
          '$unwind': {
            'path': '$brokerData',
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$lookup': {
            'from': 'follows',
            'localField': 'brokerId',
            'foreignField': 'followFor',
            'as': 'followData'
          }
        }, {
          '$addFields': {
            'followerCount': {
              '$size': '$followData'
            }
          }
        },
        {
          '$project': {
            '_id': 1,
            'propertyStateAddress': 1,
            'propertyCityAddress': 1,
            'propertyLocalityAddress': 1,
            'price': 1,
            'createdAt': 1,
            'brokerName': '$brokerData.fullName',
            'propertyType': 1,
            'propertyAsHotDeal': 1,
            'propertyAsPrimeListing': 1
          }
        },
      ];

      if (searchValue) {
        aggregateQuery.push(
          {
            '$match': {
              '$or': [
                {
                  propertyStateAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
                },
                {
                  propertyCityAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
                {
                  propertyLocalityAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
                {
                  brokerName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
              ]
            }
          },
        )
      }

      if (city || state || locality || propertyType || typeOfProperty) {

        if (req.query.typeOfProperty == "allProperty") {
          console.log('allProperty')
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = city);
          locality && (whereArr['propertyLocalityAddress'] = locality);
          propertyType && (whereArr['propertyType'] = propertyType);
        }
        else if (req.query.typeOfProperty == "hotdeal") {
          console.log('hotdeal')
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = city);
          locality && (whereArr['propertyLocalityAddress'] = locality);
          propertyType && (whereArr['propertyType'] = propertyType);
          (whereArr['propertyAsHotDeal'] = true);
        }
        else if (req.query.typeOfProperty == "exclusive") {
          console.log('exclusive')
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = city);
          locality && (whereArr['propertyLocalityAddress'] = locality);
          propertyType && (whereArr['propertyType'] = propertyType);
          (whereArr['propertyAsPrimeListing'] = true);
        }
      }

      if (whereArr) {
        aggregateQuery.push({
          '$match': whereArr
        })
      }

      aggregateQuery.push(
        {
          '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
      );

      const res = await property.aggregate(aggregateQuery)
      return res;
    } else if (req.user.group == 1) {
      var page = limit * page;
      const { searchValue, projectSpecilization, propertyType, developer, project
        , stageOfConstruction, plotAreaUnit, facingType, apartmentFurnishing, facingDirection
        , distressSale, area_min, area_max, price_min, price_max, floor } = req.query;
      let whereArr = {};

      var aggregateQuery = [
        {
          '$lookup': {
            'from': 'brokers',
            'localField': 'brokerId',
            'foreignField': '_id',
            'as': 'brokerData'
          }
        }, {
          '$unwind': {
            'path': '$brokerData',
            'preserveNullAndEmptyArrays': false
          }
        }, {
          '$lookup': {
            'from': 'follows',
            'localField': 'brokerId',
            'foreignField': 'followFor',
            'as': 'followData'
          }
        }, {
          '$addFields': {
            'followerCount': {
              '$size': '$followData'
            }
          }
        }, {
          '$project': {
            '_id': 1,
            'propertyImage': 1,
            'unitType': 1,
            'constructedAreaVal': 1,
            'plotAreaVal': 1,
            'constructedAreaUnit': 1,
            'plotAreaUnit': 1,
            'propertyCityAddress': 1,
            'propertyStateAddress': 1,
            'propertyLocalityAddress': 1,
            'price': 1,
            'commission': {
              '$cond': {
                'if': {
                  '$eq': [
                    '$brokerData.isProfileVerify', true
                  ]
                },
                'then': '$commission',
                'else': null
              }
            },
            'chooseCategory': 1,
            'propertyNature': 1,
            'propertyAsHotDeal': 1,
            'propertyAsPrimeListing': 1,
            'isSold': 1,
            'followerCount': 1,
            'companyName': '$brokerData.companyName',
            'profileImage': '$brokerData.profileImage',
            'fullName': '$brokerData.fullName',
            'isProfileVerify': '$brokerData.isProfileVerify',
            'dealLocality': '$brokerData.dealLocality',
            'createdAt': 1,
            'isActive': 1,
            'selector': '$brokerData.selector',
            'propertyType': 1,
            'developeName': 1,
            'projectName': 1,
            'distressSale': 1,
            'stageOfConstruction': 1,
            'topFloorProperty': 1,
            'groundFloorProperty': 1,
            'facingType': 1,
            'apartmentFurnishing': 1,
            'facingDirection': 1
          }
        },
      ];

      if (searchValue) {
        aggregateQuery.push(
          {
            '$match': {
              '$or': [
                {
                  propertyStateAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
                },
                {
                  propertyCityAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
                {
                  propertyLocalityAddress: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
                {
                  developer: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
                {
                  project: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
                },
              ]
            }
          },
        )
      }

      if (projectSpecilization || propertyType || developer || project
        || stageOfConstruction || plotAreaUnit || facingType || apartmentFurnishing || facingDirection
        || distressSale || area_min || area_max || price_min || price_max || floor ||
        req.query.propertynearyou || req.query.hotDeal || req.query.exclusive) {
        if (req.query.propertynearyou) {
          whereArr['propertyAsHotDeal'] = false;
          whereArr['propertyAsPrimeListing'] = false;
          whereArr['isSold'] = false;
          whereArr['isActive'] = true;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });
          projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
          propertyType && (whereArr['propertyType'] = { $in: propertyType });
          developer && (whereArr['developeName'] = { $in: developer });
          project && (whereArr['projectName'] = { $in: project });
          stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });
          plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
          facingType && (whereArr['facingType'] = { $in: facingType });
          apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
          facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });

          if (distressSale == true || distressSale == false) { whereArr['distressSale'] = distressSale; }

          if (area_min && area_max) {
            whereArr['plotAreaVal'] = { $gte: parseInt(area_min), $lte: parseInt(area_max) }
          }

          if (price_min && price_max) {
            whereArr['price'] = { $gte: parseInt(price_min), $lte: parseInt(price_max) }
          }

          if (parseInt(floor) == 1) {
            whereArr['topFloorProperty'] = true;
          }

          if (parseInt(floor) == 2) { whereArr['groundFloorProperty'] = true; }
        }
        else if (req.query.hotDeal) {
          whereArr['propertyAsHotDeal'] = true;
          whereArr['isActive'] = true;
          whereArr['isSold'] = false;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });
          projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
          propertyType && (whereArr['propertyType'] = { $in: propertyType });
          developer && (whereArr['developeName'] = { $in: developer });
          project && (whereArr['projectName'] = { $in: project });
          stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });
          plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
          facingType && (whereArr['facingType'] = { $in: facingType });
          apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
          facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });

          if (distressSale == true || distressSale == false) { whereArr['distressSale'] = distressSale; }

          if (area_min && area_max) {
            whereArr['plotAreaVal'] = { $gte: parseInt(area_min), $lte: parseInt(area_max) }
          }

          if (price_min && price_max) {
            whereArr['price'] = { $gte: parseInt(price_min), $lte: parseInt(price_max) }
          }

          if (parseInt(floor) == 1) {
            whereArr['topFloorProperty'] = true;
          }

          if (parseInt(floor) == 2) { whereArr['groundFloorProperty'] = true; }
        }
        else if (req.query.exclusive) {
          whereArr['propertyAsPrimeListing'] = true;
          whereArr['isActive'] = true;
          whereArr['isSold'] = false;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });
          projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
          propertyType && (whereArr['propertyType'] = { $in: propertyType });
          developer && (whereArr['developeName'] = { $in: developer });
          project && (whereArr['projectName'] = { $in: project });
          stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });
          plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
          facingType && (whereArr['facingType'] = { $in: facingType });
          apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
          facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });

          if (distressSale == true || distressSale == false) { whereArr['distressSale'] = distressSale; }

          if (area_min && area_max) {
            whereArr['plotAreaVal'] = { $gte: parseInt(area_min), $lte: parseInt(area_max) }
          }

          if (price_min && price_max) {
            whereArr['price'] = { $gte: parseInt(price_min), $lte: parseInt(price_max) }
          }

          if (parseInt(floor) == 1) {
            whereArr['topFloorProperty'] = true;
          }

          if (parseInt(floor) == 2) { whereArr['groundFloorProperty'] = true; }
        }



      }

      if (whereArr) {
        aggregateQuery.push({
          '$match': whereArr
        })
      }

      aggregateQuery.push(
        {
          '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
      );

      const res = await property.aggregate(aggregateQuery)
      return res;
    }
  } catch (error) {
    console.log(error)
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

/* broker get search and filter comman api */
module.exports.brokerSearch = async (req, limit, page) => {
  try {
    if (req.user.group == 2) {
      var page = limit * page;
      const { searchValue, intrestState, interestCity, dealLocality, projectSpecilization, brokerType } = req.query;
      let whereArr = {};
      console.log(searchValue);

      var aggregateQuery = [
        {
          $match: { _id: { $ne: req.user._id }, group: { $ne: 2 } }
        },
        {
          $lookup: {
            from: 'properties',
            as: 'property',
            let: { brokerId: '$_id' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ['$brokerId', '$$brokerId'] },
                      { $eq: ['$isActive', true] },
                    ]
                  }
                }
              }
            ]
          }
        },
        {
          '$addFields': {
            'propertyCount': {
              '$size': '$property'
            }
          }
        },
        {
          '$project': {
            '_id': 1,
            'fullName': 1,
            'interestCity': 1,
            'dealLocality': 1,
            'intrestState': 1,
            'officeState': 1,
            'officeCity': 1,
            'officeLocality': 1,
            'mobile': 1,
            'selector': 1,
            'propertyCount': 1,
            'createdAt': 1,
            'isProfileVerify': 1,
            'isSuper': 1

          }
        },
      ];
      if (searchValue) {
        aggregateQuery.push(
          {
            '$match': {
              '$or': [
                {
                  fullName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
                },
                {
                  mobile: { '$regex': new RegExp(searchValue.replace(/\s+/g, '\\s+'), 'gi') }
                }
              ]
            }
          },
        )
      }

      if (intrestState || interestCity || dealLocality || projectSpecilization || brokerType) {

        if (req.query.brokerType == 'allBroker') {
          console.log(interestCity);
          intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
          interestCity && (whereArr['interestCity'] = { $in: interestCity });
          dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
          projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
        }
        else if (req.query.brokerType == 'verified') {
          intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
          interestCity && (whereArr['interestCity'] = { $in: interestCity });
          dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
          projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
          (whereArr['isProfileVerify'] = true);
        }
        else if (req.query.brokerType == 'unverified') {
          intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
          interestCity && (whereArr['interestCity'] = { $in: interestCity });
          dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
          projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
          (whereArr['isProfileVerify'] = false);
        }
        else if (req.query.brokerType == 'superroker') {
          intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
          interestCity && (whereArr['interestCity'] = { $in: interestCity });
          dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
          projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
          (whereArr['isSuper'] = true);
        }
      }
      console.log(whereArr);
      if (whereArr) {
        aggregateQuery.push({
          '$match': whereArr
        })
      }

      aggregateQuery.push(
        {
          '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
      );

      const res = await broker.aggregate(aggregateQuery)
      return res;
    } else if (req.user.group == 1) {
      var page = limit * page;
      const { dealLocality, interestCity, intrestState, brokerName, dealIn, propertyNature, projectSpecilization, specializationSubType, isProfileVerify, isSuper, projectName, developeName } = req.query;
      let whereArr = {};
      var authUser;
      if ((!interestCity) && (!dealLocality) && (!interestCity) && (!intrestState) && (!brokerName) && (!dealIn) && (!propertyNature) && (!projectSpecilization) && (!specializationSubType) && (!isProfileVerify) && (!isSuper) && (!developeName) && (!projectName))
        authUser = req.user.interestCity;

      var aggregateQuery = [
        {
          $match: { _id: { $ne: req.user._id }, group: { $ne: 2 } }
        },
        {
          '$lookup': {
            'from': 'properties',
            'localField': '_id',
            'foreignField': 'brokerId',
            'as': 'result'
          }
        },
        {
          '$lookup': {
            'from': 'follows',
            'localField': '_id',
            'foreignField': 'followFor',
            'as': 'followData'
          }
        },
        {
          '$addFields': {
            'followerCount': {
              '$size': '$followData'
            }
          }
        },
        // {
        //   '$unwind': {
        //     'path': '$result',
        //     'preserveNullAndEmptyArrays': true
        //   }
        // },
        {
          '$lookup': {
            'from': 'propertydevelopers',
            'localField': 'developerId',
            'foreignField': '_id',
            'as': 'developerInfo'
          }
        },
        // {
        //   '$unwind': {
        //     'path': '$developerInfo',
        //     'preserveNullAndEmptyArrays': true
        //   }
        // },
        {
          '$lookup': {
            'from': 'propertyprojects',
            'localField': 'projectId',
            'foreignField': '_id',
            'as': 'projectInfo'
          }
        },
        // {
        //   '$unwind': {
        //     'path': '$projectInfo',
        //     'preserveNullAndEmptyArrays': true
        //   }
        // },
        {
          '$project': {
            '_id': 1,
            'officeLocality': 1,
            'isSuper': 1,
            'isProfileVerify': 1,
            'dealIn': 1,
            'specializationSubType': 1,
            'followerCount': 1,
            'profileImage': 1,
            'result.plotAreaVal': 1,
            'result.plotAreaUnit': 1,
            'chooseCategory': '$result.chooseCategory',
            'fullName': 1,
            'selector': 1,
            'interestCity': 1,
            'dealLocality': 1,
            'intrestState': 1,
            'developeName': { $ifNull: ["$developerInfo.developeName", ""] },
            'projectName': { $ifNull: ["$projectInfo.projectName", ""] },
          }
        },
      ];

      if (dealLocality || interestCity || intrestState || brokerName || dealIn || authUser || propertyNature || projectSpecilization || specializationSubType || isProfileVerify || isSuper || developeName || projectName) {
        dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
        interestCity && (whereArr['interestCity'] = { $in: interestCity });
        intrestState && (whereArr['intrestState'] = { $in: intrestState });
        brokerName && (whereArr['fullName'] = { $regex: new RegExp(RegExp.escape(brokerName), 'i') });
        dealIn && (whereArr['dealIn'] = { $in: dealIn });
        propertyNature && (whereArr['chooseCategory'] = { $in: propertyNature });
        projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
        developeName && (whereArr['developeName'] = { $in: developeName });
        specializationSubType && (whereArr['specializationSubType'] = { $in: specializationSubType });
        projectName && (whereArr['projectName'] = { $in: projectName });
        isProfileVerify && (whereArr['isProfileVerify'] = true);
        isProfileVerify && (whereArr['isProfileVerify'] = false);
        isSuper && (whereArr['isSuper'] = true);
        authUser && (whereArr['interestCity'] = { $in: authUser });

        // if (req.query.brokerType == 'allBroker') {
        //   intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
        //   interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
        //   dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
        //   projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
        // }
        // else if (req.query.brokerType == 'verified') {
        //   intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
        //   interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
        //   dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
        //   projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
        //   (whereArr['isProfileVerify'] = true);
        // }
        // else if (req.query.brokerType == 'unverified') {
        //   intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
        //   interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
        //   dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
        //   projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
        //   (whereArr['isProfileVerify'] = false);
        // }
        // else if (req.query.brokerType == 'superroker') {
        //   intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
        //   interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
        //   dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
        //   projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
        //   (whereArr['isSuper'] = true);
        // }
      }

      if (whereArr) {
        aggregateQuery.push({
          '$match': whereArr
        })
      }
      var cout = [...aggregateQuery];
      const res1 = await broker.aggregate(cout);
      console.log(res1.length);
      aggregateQuery.push(
        {
          '$sort': { 'followerCount': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
      );

      const res2 = await broker.aggregate(aggregateQuery)
      return [res2, res1.length];
    }
  } catch (error) {
    console.log(error)
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

module.exports.brokerFilter = async (req, limit, page) => {
  var page = limit * page;
  let whereArr = {};
  const { interestCity, dealLocality, intrestState, projectSpecilization } = req.body;
  if (req.body.brokerType == 'allBroker') {
    intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
    interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
    dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
    projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
  }
  else if (req.body.brokerType == 'verified') {
    intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
    interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
    dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
    projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
    (whereArr['isProfileVerify'] = true);
  }
  else if (req.body.brokerType == 'unverified') {
    intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
    interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
    dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
    projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
    (whereArr['isProfileVerify'] = false);
  }
  else if (req.body.brokerType == 'superroker') {
    intrestState && (whereArr['intrestState'] = { $in: [intrestState] });
    interestCity && (whereArr['interestCity'] = { $in: [interestCity] });
    dealLocality && (whereArr['dealLocality'] = { $in: [dealLocality] });
    projectSpecilization && (whereArr['selector'] = { $in: [projectSpecilization] });
    (whereArr['isSuper'] = true);
  }

  const res = await broker.aggregate(
    [
      {
        '$lookup': {
          'from': 'properties',
          'localField': '_id',
          'foreignField': 'brokerId',
          'as': 'result'
        }
      }, {
        '$addFields': {
          'propertyCount': {
            '$size': '$result'
          }
        }
      },
      {
        '$unwind': {
          'path': '$result',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$project': {
          '_id': 1,
          'fullName': 1,
          'interestCity': 1,
          'dealLocality': 1,
          'intrestState': 1,
          'mobile': 1,
          'selector': 1,
          'propertyCount': 1,
          'createdAt': 1,
          'isProfileVerify': 1,
          'isSuper': 1

        }
      },
      {
        '$match': whereArr
      },
      {
        '$sort': { '_id': -1 }
      },
      { '$skip': page },
      { '$limit': limit }
    ]

  );
  return res;
}

/* developer get search and filter comman api */
module.exports.developerSearch = async (req, limit, page) => {
  var page = limit * page;
  const { searchValue, city, state, locality } = req.query;
  const propertyMin = Number(req.query.propertyMin);
  const propertyMax = Number(req.query.propertyMax);

  let whereArr = {};
  var aggregateQuery = [
    // {
    //   '$lookup': {
    //     'from': 'properties',
    //     'localField': '_id',
    //     'foreignField': 'propertyDeveloperId',
    //     'as': 'propertyData'
    //   }
    // }, {
    //   '$addFields': {
    //     'propertyCount': {
    //       '$size': '$propertyData'
    //     }
    //   }
    // }, 
    // {
    //   '$unwind': {
    //     'path': '$propertyData',
    //     'preserveNullAndEmptyArrays': true
    //   }
    // }, 
    {
      $match: { isActive: true }
    },

    {
      '$project': {
        '_id': 1,
        'developeHeadquaterCity': '$developeHeadquaterLocation.city',
        'developeHeadquaterState': '$developeHeadquaterLocation.state',
        'developeHeadquaterLocality': '$developeHeadquaterLocation.locality',
        'developeName': 1,
        'createdAt': 1,
        'developeLogo': 1
        // 'propertyCount': 1
      }
    },
  ];

  if (searchValue) {
    aggregateQuery.push(
      {
        '$match': {
          '$or': [
            {
              developeHeadquaterCity: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
            },
            {
              developeHeadquaterState: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
            },
            {
              developeHeadquaterLocality: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
            },
            {
              developeName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
            },
          ]
        }
      },
    )
  }

  if (city || state || locality || propertyMin || propertyMax) {
    city && (whereArr['developeHeadquaterCity'] = { $in: city });
    state && (whereArr['developeHeadquaterState'] = { $in: state });
    locality && (whereArr['developeHeadquaterLocality'] = { $in: locality });

    if (propertyMin && propertyMax) {
      whereArr['propertyCount'] = { $gte: propertyMin, $lte: propertyMax }
    }
  }
  console.log(whereArr);

  if (whereArr) {
    aggregateQuery.push({
      '$match': whereArr
    })
  }

  aggregateQuery.push(
    {
      '$sort': { '_id': -1 }
    },
    { '$skip': page },
    { '$limit': limit }
  );

  const res = await propertyDeveloper.aggregate(aggregateQuery)
  return res;
}
module.exports.developerFilter = async (req, limit, page) => {
  var page = limit * page;
  let whereArr = {};
  const { city, state, locality, propertyMin, propertyMax } = req.body;

  city && (whereArr['developeHeadquaterCity'] = { $in: [city] });
  state && (whereArr['developeHeadquaterState'] = { $in: [state] });
  locality && (whereArr['developeHeadquaterLocality'] = { $in: [locality] });

  if (propertyMin && propertyMax) {
    whereArr['propertyCount'] = { $gte: propertyMin, $lte: propertyMax }
  }

  const res = await propertyDeveloper.aggregate(
    [
      {
        '$lookup': {
          'from': 'properties',
          'localField': '_id',
          'foreignField': 'propertyDeveloperId',
          'as': 'propertyData'
        }
      },
      {
        '$addFields': {
          'propertyCount': {
            '$size': '$propertyData'
          }
        }
      },
      {
        '$unwind': {
          'path': '$propertyData',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$project': {
          '_id': 1,
          'developeHeadquaterCity': '$developeHeadquaterLocation.city',
          'developeHeadquaterState': '$developeHeadquaterLocation.state',
          'developeHeadquaterLocality': '$developeHeadquaterLocation.locality',
          'developeName': 1,
          'createdAt': 1,
          'propertyCount': 1
        }
      },
      {
        '$match': whereArr
      },
      {
        '$sort': { '_id': -1 }
      },
      { '$skip': page },
      { '$limit': limit }
    ]

  );
  return res;
}

/* project get search and filter comman api */
module.exports.projectSearch = async (req, limit, page) => {
  try {
    var page = limit * page;
    const { searchValue, projectType, city, state, locality } = req.query;
    let whereArr = {};
    var aggregateQuery = [
      {
        $match: { isActive: true }
      },
      {
        '$lookup': {
          'from': 'propertydevelopers',
          'localField': 'developerId',
          'foreignField': '_id',
          'as': 'projectData'
        }
      }, {
        '$unwind': {
          'path': '$projectData',
          'preserveNullAndEmptyArrays': true
        }
      }, {
        '$project': {
          '_id': 1,
          'projectName': 1,
          'developeName': '$projectData.developeName',
          'createdAt': 1,
          'projectType': 1,
          'projectLocationCity': '$projectLocation.city',
          'projectLocationState': '$projectLocation.state',
          'projectLocationLocality': '$projectLocation.locality',
        }
      },
    ];

    if (searchValue) {
      aggregateQuery.push(
        {
          '$match': {
            '$or': [
              {
                projectName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
              },
              {
                developeName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
              },
              {
                projectLocationCity: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
              },
              {
                projectLocationState: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
              },
              {
                projectLocationLocality: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
              },
              {
                projectType: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
              },
            ]
          }
        }
      )
    }

    if (city || state || locality || projectType) {
      projectType && (whereArr['projectType'] = { $in: [projectType] });
      city && (whereArr['projectLocationCity'] = { $in: [city] });
      state && (whereArr['projectLocationState'] = { $in: [state] });
      locality && (whereArr['projectLocationLocality'] = { $in: [locality] });
    }
    if (whereArr) {
      aggregateQuery.push({
        '$match': whereArr
      })
    }

    aggregateQuery.push(
      {
        '$sort': { '_id': -1 }
      },
      { '$skip': page },
      { '$limit': limit }
    );

    const res = await propertyproject.aggregate(aggregateQuery)
    return res;
  } catch (error) {
    console.log(error, "error")
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

// const res = await propertyproject.aggregate(
//   [
//     {
//       '$lookup': {
//         'from': 'propertydevelopers',
//         'localField': 'developerId',
//         'foreignField': '_id',
//         'as': 'projectData'
//       }
//     }, {
//       '$unwind': {
//         'path': '$projectData',
//         'preserveNullAndEmptyArrays': false
//       }
//     }, {
//       '$project': {
//         '_id': 1,
//         'projectName': 1,
//         'developeName': '$projectData.developeName',
//         'createdAt': 1,
//         'projectType': 1,
//         'projectLocation': 1
//       }
//     },
//     {
//       '$match': {
//         '$or': [
//           {
//             projectName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') },
//           },
//           {
//             developeName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
//           },
//           {
//             projectLocation: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
//           },
//           {
//             projectType: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
//           },
//         ]
//       }
//     },
//     {
//       '$sort': { '_id': -1 }
//     },
//     { '$skip': page },
//     { '$limit': limit }
//   ]
// );
// return res;
// }

module.exports.projectFilter = async (req, limit, page) => {
  var page = limit * page;
  let whereArr = {};
  const { projectType, city, state, locality } = req.body;

  projectType && (whereArr['projectType'] = { $in: [projectType] });
  city && (whereArr['projectLocation.city'] = { $in: [city] });
  state && (whereArr['projectLocation.state'] = { $in: [state] });
  locality && (whereArr['projectLocation.locality'] = { $in: [locality] });

  const res = await propertyproject.aggregate(
    [
      {
        '$lookup': {
          'from': 'propertydevelopers',
          'localField': 'developerId',
          'foreignField': '_id',
          'as': 'projectData'
        }
      }, {
        '$unwind': {
          'path': '$projectData',
          'preserveNullAndEmptyArrays': false
        }
      }, {
        '$project': {
          '_id': 1,
          'projectName': 1,
          'developeName': '$projectData.developeName',
          'createdAt': 1,
          'projectType': 1,
          'projectLocation': 1
        }
      },
      {
        '$match': whereArr
      },
      {
        '$sort': { '_id': -1 }
      },
      { '$skip': page },
      { '$limit': limit }
    ]

  );
  return res;
}

module.exports.searchState = async (req, limit, page) => {
  try {
    var page = limit * page;
    const { searchValue, state_id } = req.query;
    if (Array.isArray(state_id)) {
      function toNumber(value) {
        return Number(value);
      }
      var state_Ids = state_id.map(toNumber);
    }

    var aggregateQuery = [
      {
        '$match': { 'country_id': 101 }
      },
      {
        '$project': {
          'id': 1,
          'name': 1,
          'country_id': 1,
        }
      },
    ];

    if (searchValue) {
      aggregateQuery.push(
        {
          '$match': {
            name: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
        }
      )
    }
    if (Array.isArray(state_Ids)) {
      aggregateQuery.push(
        {

          '$match': { 'id': { $in: state_Ids } }

        }
      )
    } else if (state_id) {
      aggregateQuery.push(
        {

          '$match': { 'id': Number(state_id) }

        }
      )
    }

    aggregateQuery.push(
      {
        '$sort': { 'name': 1 }
      },
    );

    const res = await state.aggregate(aggregateQuery)
    return res;
  } catch (error) {
    console.log(error, "error")
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

module.exports.searchCity = async (req, limit, page) => {
  try {

    var page = limit * page;
    const { searchValue, state_id } = req.query;
    if (Array.isArray(state_id)) {
      function toNumber(value) {
        return Number(value);
      }
      var state_Ids = state_id.map(toNumber);
    }


    var aggregateQuery = [
      {
        '$match': { 'country_id': 101 }
      },
      {
        '$project': {
          'id': 1,
          'name': 1,
          'country_id': 1,
          'state_id': 1
        }
      },
    ];

    if (searchValue) {
      aggregateQuery.push(
        {
          '$match': {
            name: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
        }
      )
    }
    if (Array.isArray(state_Ids)) {
      aggregateQuery.push(
        {

          '$match': { 'state_id': { $in: state_Ids } }

        }
      )
    } else if (state_id) {
      aggregateQuery.push(
        {

          '$match': { 'state_id': Number(state_id) }

        }
      )
    }

    aggregateQuery.push(
      {
        '$sort': { 'name': 1 }
      },
    );

    const res = await city.aggregate(aggregateQuery)
    return res;
  } catch (error) {
    console.log(error, "error")
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

module.exports.searchLocality = async (req, limit, page) => {
  try {
    var page = limit * page;
    const { searchValue, city_id } = req.query;
    if (city_id) {
      function toNumber(value) {
        return Number(value);
      }
      var city_Ids = city_id.map(toNumber);
    }

    var aggregateQuery = [
      {
        '$project': {
          '_id': 1,
          'name': '$Name',
          'stateId': 1,
          'cityId': 1,
        }
      },
    ];

    if (searchValue) {
      aggregateQuery.push(
        {
          '$match': {
            name: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          },
        }
      )
    }
    if (city_id) {
      aggregateQuery.push(
        {

          '$match': { 'cityId': { $in: city_Ids } }

        }
      )
    }

    aggregateQuery.push(
      {
        '$sort': { 'name': 1 }
      },
      // { '$skip': page },
      // { '$limit': limit }
    );

    const res = await locality.aggregate(aggregateQuery)
    return res;
  } catch (error) {
    console.log(error, "error")
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}

// module.exports.searchProfileVerification = async (req, limit, page) => {
//   console.log(req.body);
//   var page = limit * page;
//   let whereArr = {};
//   const { brokerName, interestCity, dealLocality, intrestState, dealIn, propertyNature, specializationSubType, projectSpecilization } = req.body;
//   (whereArr['fullName'] = { $regex: new RegExp(RegExp.escape(brokerName), 'i') });
//   (whereArr['intrestState'] = { $in: intrestState });
//   (whereArr['interestCity'] = { $in: interestCity });
//   (whereArr['dealLocality'] = { $in: dealLocality });
//   (whereArr['dealIn'] = { $in: dealIn });
//   (whereArr['chooseCategory'] = { $in: propertyNature });
//   (whereArr['selector'] = { $in: projectSpecilization });
//   (whereArr['specializationSubType'] = { $in: specializationSubType });
//   console.log(whereArr);

//   const res = await broker.aggregate(
//     [
//       {
//         '$lookup': {
//           'from': 'properties',
//           'localField': '_id',
//           'foreignField': 'brokerId',
//           'as': 'result'
//         }
//       }, {
//         '$lookup': {
//           'from': 'follows',
//           'localField': '_id',
//           'foreignField': 'followFor',
//           'as': 'followData'
//         }
//       }, {
//         '$addFields': {
//           'followerCount': {
//             '$size': '$followData'
//           }
//         }
//       },
//       {
//         '$unwind': {
//           'path': '$result',
//           'preserveNullAndEmptyArrays': false
//         }
//       },
//       {
//         '$project': {
//           '_id': 1,
//           'officeLocality': 1,
//           'isSuper': 1,
//           'dealIn': 1,
//           'specializationSubType': 1,
//           'followerCount': 1,
//           'profileImage': 1,
//           'result.plotAreaVal': 1,
//           'result.plotAreaUnit': 1,
//           'chooseCategory': '$result.chooseCategory',
//           'fullName': 1,
//           'selector': 1,
//           'interestCity': 1,
//           'dealLocality': 1,
//           'intrestState': 1
//         }
//       },
//       {
//         '$match': whereArr
//       },
//       {
//         '$sort': { '_id': -1 }
//       },
//       { '$skip': page },
//       { '$limit': limit }
//     ]
//   );
//   return res;
// }

// module.exports.filterProfileVerification = async (req, limit, page) => {
//   console.log(req.body);
//   var page = limit * page;
//   let whereArr = {};
//   const { interestCity, dealLocality, intrestState, dealIn, propertyNature, specializationSubType, projectSpecilization } = req.body;
//   (whereArr['intrestState'] = { $eq: intrestState });
//   (whereArr['interestCity'] = { $eq: interestCity });
//   (whereArr['dealLocality'] = { $eq: dealLocality });
//   (whereArr['dealIn'] = { $in: dealIn });
//   (whereArr['chooseCategory'] = { $in: propertyNature });
//   (whereArr['selector'] = { $in: projectSpecilization });
//   (whereArr['specializationSubType'] = { $in: specializationSubType });
//   console.log(whereArr);

//   const res = await broker.aggregate(
//     [
//       {
//         '$lookup': {
//           'from': 'properties',
//           'localField': '_id',
//           'foreignField': 'brokerId',
//           'as': 'result'
//         }
//       }, {
//         '$lookup': {
//           'from': 'follows',
//           'localField': '_id',
//           'foreignField': 'followFor',
//           'as': 'followData'
//         }
//       }, {
//         '$addFields': {
//           'followerCount': {
//             '$size': '$followData'
//           }
//         }
//       },
//       {
//         '$unwind': {
//           'path': '$result',
//           'preserveNullAndEmptyArrays': false
//         }
//       },
//       {
//         '$project': {
//           '_id': 1,
//           'officeLocality': 1,
//           'isSuper': 1,
//           'dealIn': 1,
//           'specializationSubType': 1,
//           'followerCount': 1,
//           'profileImage': 1,
//           'result.plotAreaVal': 1,
//           'result.plotAreaUnit': 1,
//           'chooseCategory': '$result.chooseCategory',
//           'fullName': 1,
//           'selector': 1,
//           'interestCity': 1,
//           'dealLocality': 1,
//           'intrestState': 1
//         }
//       },
//       {
//         '$match': whereArr
//       },
//       {
//         '$sort': { '_id': -1 }
//       },
//       { '$skip': page },
//       { '$limit': limit }
//     ]

//   );
//   return res;
// }

// module.exports.searchFlagProperty = async (req, limit, page) => {
//   console.log(req.body);
//   var page = limit * page;
//   let whereArr = {};
//   const { brokerName, interestCity, dealLocality, intrestState, dealIn, propertyNature, specializationSubType, projectSpecilization } = req.body;
//   (whereArr['fullName'] = { $regex: new RegExp(RegExp.escape(brokerName), 'i') });
//   (whereArr['intrestState'] = { $in: intrestState });
//   (whereArr['interestCity'] = { $in: interestCity });
//   (whereArr['dealLocality'] = { $in: dealLocality });
//   (whereArr['dealIn'] = { $in: dealIn });
//   (whereArr['chooseCategory'] = { $in: propertyNature });
//   (whereArr['selector'] = { $in: projectSpecilization });
//   (whereArr['specializationSubType'] = { $in: specializationSubType });
//   console.log(whereArr);

//   const res = await flag.aggregate(
//     [
//       {
//         '$lookup': {
//           'from': 'properties',
//           'localField': '_id',
//           'foreignField': 'brokerId',
//           'as': 'result'
//         }
//       }, {
//         '$lookup': {
//           'from': 'follows',
//           'localField': '_id',
//           'foreignField': 'followFor',
//           'as': 'followData'
//         }
//       }, {
//         '$addFields': {
//           'followerCount': {
//             '$size': '$followData'
//           }
//         }
//       },
//       {
//         '$unwind': {
//           'path': '$result',
//           'preserveNullAndEmptyArrays': false
//         }
//       },
//       {
//         '$project': {
//           '_id': 1,
//           'officeLocality': 1,
//           'isSuper': 1,
//           'dealIn': 1,
//           'specializationSubType': 1,
//           'followerCount': 1,
//           'profileImage': 1,
//           'result.plotAreaVal': 1,
//           'result.plotAreaUnit': 1,
//           'chooseCategory': '$result.chooseCategory',
//           'fullName': 1,
//           'selector': 1,
//           'interestCity': 1,
//           'dealLocality': 1,
//           'intrestState': 1
//         }
//       },
//       {
//         '$match': whereArr
//       },
//       {
//         '$sort': { '_id': -1 }
//       },
//       { '$skip': page },
//       { '$limit': limit }
//     ]
//   );
//   return res;
// }

// module.exports.filterFlagProperty = async (req, limit, page) => {
//   console.log(req.body);
//   var page = limit * page;
//   let whereArr = {};
//   const { interestCity, dealLocality, intrestState, dealIn, propertyNature, specializationSubType, projectSpecilization } = req.body;
//   (whereArr['intrestState'] = { $eq: intrestState });
//   (whereArr['interestCity'] = { $eq: interestCity });
//   (whereArr['dealLocality'] = { $eq: dealLocality });
//   (whereArr['dealIn'] = { $in: dealIn });
//   (whereArr['chooseCategory'] = { $in: propertyNature });
//   (whereArr['selector'] = { $in: projectSpecilization });
//   (whereArr['specializationSubType'] = { $in: specializationSubType });
//   console.log(whereArr);

//   const res = await flag.aggregate(
//     [
//       {
//         '$lookup': {
//           'from': 'properties',
//           'localField': '_id',
//           'foreignField': 'brokerId',
//           'as': 'result'
//         }
//       }, {
//         '$lookup': {
//           'from': 'follows',
//           'localField': '_id',
//           'foreignField': 'followFor',
//           'as': 'followData'
//         }
//       }, {
//         '$addFields': {
//           'followerCount': {
//             '$size': '$followData'
//           }
//         }
//       },
//       {
//         '$unwind': {
//           'path': '$result',
//           'preserveNullAndEmptyArrays': false
//         }
//       },
//       {
//         '$project': {
//           '_id': 1,
//           'officeLocality': 1,
//           'isSuper': 1,
//           'dealIn': 1,
//           'specializationSubType': 1,
//           'followerCount': 1,
//           'profileImage': 1,
//           'result.plotAreaVal': 1,
//           'result.plotAreaUnit': 1,
//           'chooseCategory': '$result.chooseCategory',
//           'fullName': 1,
//           'selector': 1,
//           'interestCity': 1,
//           'dealLocality': 1,
//           'intrestState': 1
//         }
//       },
//       {
//         '$match': whereArr
//       },
//       {
//         '$sort': { '_id': -1 }
//       },
//       { '$skip': page },
//       { '$limit': limit }
//     ]

//   );
//   return res;
// }