const { propertyReport, property } = require("./schema");
const follow = require("../Followers/schema");
const callRequest = require("../Callrequest/schema");
const flagProperty = require("../Flagproperty/schema");
const broker = require("../Brokers/schema");
const Soldproperty = require("../Soldproperty/schema");
const propertyBookMark = require("../Wishlist/schema");
const { plotAreaInitialisation, constructedAreaInitialisation } = require('../../utils/helperFunction');
const reView = require("../Review/schema");
const saveProperty = require("../Wishlist/schema");
const { propertyDeveloper, propertyproject } = require("../Admin/schema");
const { state, city, locality } = require("../common/schema");
const { ObjectId } = require('mongoose').Types;
RegExp.escape = function (s) {
  return s.replace(/[-\\/\\^$*+?.()|[\]{}]/g, '\\$&');
}

/**
 * @author - atul singh chauhan
 * @propertyCreate - create property
 * @param {*} req 
 * @returns 
 */
module.exports.propertyCreate = async (req) => {
  return await property.create(req);
}

/**
 * @author - atul singh chauhan
 * @propertyFind - find property
 * @param {*} req 
 * @returns 
 */
module.exports.propertyFind = async (req) => {
  return await property.findById({ _id: req });
}

/**
 * @author - atul singh chauhan
 * @showNewProperty - show property
 * @param {*} perPage 
 * @param {*} page 
 * @returns 
 */
module.exports.showNewProperty = async (req, limit, page) => {
  try {
    var page = limit * page;
    if (req.user.group == 2) {
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
          '$lookup': {
            'from': 'propertyprojects',
            'localField': 'propertyProjectId',
            'foreignField': '_id',
            'as': 'projectInfo'
          }
        },
        {
          '$unwind': {
            'path': '$projectInfo',
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$project': {
            '_id': 1,
            'chooseCategory': 1,
            'propertyStateAddress': 1,
            'propertyCityAddress': 1,
            'propertyLocalityAddress': 1,
            'price': 1,
            'createdAt': 1,
            'brokerName': '$brokerData.fullName',
            'projectName': '$projectInfo.projectName',
            'propertyType': 1,
            'propertyAsHotDeal': 1,
            'propertyAsPrimeListing': 1,
            'brokerId': '$brokerData._id',
            'isActive': 1,
          }
        },

      ];

      if (searchValue) {
        aggregateQuery.push(
          {
            '$match': {
              '$or': [
                {
                  projectName: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
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
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = { $in: city });
          locality && (whereArr['propertyLocalityAddress'] = { $in: locality });
          propertyType && (whereArr['chooseCategory'] = propertyType);
          (whereArr['isActive'] = true);
        }
        else if (req.query.typeOfProperty == "hotdeal") {
          console.log('hotdeal')
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = { $in: city });
          locality && (whereArr['propertyLocalityAddress'] = { $in: locality });
          propertyType && (whereArr['chooseCategory'] = propertyType);
          (whereArr['propertyAsHotDeal'] = true);
          (whereArr['isActive'] = true);
        }
        else if (req.query.typeOfProperty == "exclusive") {
          console.log('exclusive')
          state && (whereArr['propertyStateAddress'] = state);
          city && (whereArr['propertyCityAddress'] = { $in: city });
          locality && (whereArr['propertyLocalityAddress'] = { $in: locality });
          propertyType && (whereArr['chooseCategory'] = propertyType);
          (whereArr['propertyAsPrimeListing'] = true);
          (whereArr['isActive'] = true);
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
      const res = await property.aggregate(aggregateQuery)
      return res;
    } else if (req.user.group == 1) {

      const { projectSpecilization, propertyType, developer, project
        , stageOfConstruction, plotAreaUnit, facingType, apartmentFurnishing, facingDirection
        , distressSale, area_min, area_max, price_min, price_max, floor, propertyStateAddress, propertyCityAddress, propertyLocalityAddress } = req.query;
      let whereArr = {};
      console.log(propertyStateAddress);

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
          '$lookup': {
            'from': 'propertydevelopers',
            'localField': 'propertyDeveloperId',
            'foreignField': '_id',
            'as': 'developerInfo'
          }
        },
        {
          '$unwind': {
            'path': '$developerInfo',
            'preserveNullAndEmptyArrays': true
          }
        },
        {
          '$lookup': {
            'from': 'propertyprojects',
            'localField': 'propertyProjectId',
            'foreignField': '_id',
            'as': 'projectInfo'
          }
        },
        {
          '$unwind': {
            'path': '$projectInfo',
            'preserveNullAndEmptyArrays': true
          }
        }
        , {
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
                    req.user.isProfileVerify, true
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
            'developeName': '$developerInfo.developeName',
            'projectName': '$projectInfo.projectName',
            'distressSale': 1,
            'stageOfConstruction': 1,
            'topFloorProperty': 1,
            'groundFloorProperty': 1,
            'facingType': 1,
            'unitType': 1,
            'apartmentFurnishing': 1,
            'facingDirection': 1,
            'isSuper': '$brokerData.isSuper',
            'brokerId': '$brokerData._id',
          }
        },
      ];

      if (projectSpecilization || propertyType || developer || project
        || stageOfConstruction || plotAreaUnit || facingType || apartmentFurnishing || facingDirection
        || distressSale || distressSale || area_min || area_max || price_min || price_max || floor
        || propertyStateAddress || propertyCityAddress || propertyLocalityAddress ||
        req.query.propertynearyou || req.query.hotDeal || req.query.exclusive) {
        if (projectSpecilization || propertyType || developer || project
          || stageOfConstruction || plotAreaUnit || facingType || apartmentFurnishing || facingDirection
          || distressSale || distressSale || area_min || area_max || price_min || price_max || floor || propertyStateAddress || propertyCityAddress || propertyLocalityAddress) {
          whereArr['isSold'] = false;
          whereArr['isActive'] = true;
          propertyStateAddress && (whereArr['propertyStateAddress'] = { $in: propertyStateAddress });
          propertyCityAddress && (whereArr['propertyCityAddress'] = { $in: propertyCityAddress });
          propertyLocalityAddress && (whereArr['propertyLocalityAddress'] = { $in: propertyLocalityAddress });
          developer && (whereArr['developeName'] = { $in: developer });
          project && (whereArr['projectName'] = { $in: project });
          projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
          propertyType && (whereArr['propertyType'] = { $in: propertyType });
          developer && (whereArr['developeName'] = { $in: developer });
          project && (whereArr['projectName'] = { $in: project });
          stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });
          plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
          facingType && (whereArr['facingType'] = { $in: facingType });
          apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
          facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });

          if (distressSale) {
            whereArr['distressSale'] = JSON.parse(distressSale);
          }

          if (area_min && area_max) {
            whereArr['plotAreaVal'] = { $gte: Number(area_min), $lte: Number(area_max) }
          }

          if (price_min && price_max) {
            whereArr['price'] = { $gte: Number(price_min), $lte: Number(price_max) }
          }

          if (Number(floor) == 1) {
            whereArr['topFloorProperty'] = true;
          }

          if (Number(floor) == 2) { whereArr['groundFloorProperty'] = true; }
        }
        else if (req.query.hotDeal) {
          whereArr['propertyAsHotDeal'] = true;
          whereArr['isActive'] = true;
          whereArr['isSold'] = false;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });
        }
        else if (req.query.exclusive) {
          whereArr['propertyAsPrimeListing'] = true;
          whereArr['isActive'] = true;
          whereArr['isSold'] = false;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });

        }
        else if (req.query.propertynearyou) {
          whereArr['isActive'] = true;
          whereArr['propertyAsPrimeListing'] = false;
          whereArr['propertyAsHotDeal'] = false;
          whereArr['isSold'] = false;
          req.user.interestCity && (whereArr['propertyCityAddress'] = { $in: req.user.interestCity });
        }
      }
      if (whereArr) {
        aggregateQuery.push({
          '$match': whereArr
        })
      }
      var cout = [...aggregateQuery];
      const res1 = await property.aggregate(cout);
      aggregateQuery.push(
        {
          '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
      );
      const res2 = await property.aggregate(aggregateQuery)
      if (req.user.isSuper == true) { return [res2, res1.length]; }
      else if (req.user.group == 2) { return [res2, res1.length]; }
      else if (req.user.isProfileVerify == false) {

        res2.forEach((val, index) => {
          if (val.propertyImage.length) {
            const imgData = val.propertyImage.filter((ele) => ele.verifiedflag == false)
            res2[index].propertyImage = imgData
          }
        })
      }
      return [res2, res1.length];
    }
  } catch (error) {
    console.log(error)
    return res.json(
      response.failure(204, message.serverResponseMessage.Catch_Error, error)
    );
  }
}



/**
 * @author - atul singh chauhan
 * @createPropertyAsHotDeal - add property in hot deal
 * @param {*} Id 
 * @returns 
 */
module.exports.createPropertyAsHotDeal = async (Id) => {
  return await property.findOneAndUpdate({
    _id: ObjectId(Id)
  }, {
    propertyAsHotDeal: true
  }).lean();
}


/**
 * @author - atul singh chauhan
 * @deletePropertyFromHotDeal - Delete Property From HotDeal
 * @param {*} Id 
 * @returns 
 */
module.exports.deletePropertyFromHotDeal = async (Id) => {
  return await property.findOneAndUpdate({
    _id: ObjectId(Id)
  }, {
    propertyAsHotDeal: false
  }).lean();
}


/**
 * @author - atul singh chauhan
 * @fetecHotDealProperty - show hot deal property
 * @param {*} perPage 
 * @param {*} page 
 * @returns 
 */
module.exports.fetecHotDealProperty = async (limit, page) => {
  var page = limit * page;
  return await property.aggregate([
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
        'propertyImage': 1,
        'unitType': 1,
        'companyName': 1,
        'constructedAreaVal': 1,
        'plotAreaVal': 1,
        'constructedAreaUnit': 1,
        'plotAreaUnit': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'commission': { $cond: { if: { $eq: ["$brokerData.isProfileVerify", true] }, then: '$commission', else: null } },
        'chooseCategory': 1,
        'propertyNature': 1,
        'propertyAsHotDeal': 1,
        'followerCount': 1,
        'brokerData.profileImage': 1,
        'brokerData.fullName': 1,
        'brokerData.isProfileVerify': 1,
        'brokerData.dealLocality': 1,
        'createdAt': 1
      }
    }
    , {
      '$match': {
        'propertyAsHotDeal': true,
      }
    },
    {
      '$sort': { 'createdAt': -1 }
    },
    { '$skip': page },
    { '$limit': limit }
  ]

  );
}

/**
 * @author - atul singh chauhan
 * @fetchApartment - fetchApartment based on city and locality
 * @param {*} req 
 * @returns 
 */
module.exports.fetchApartment = async (req, limit, page) => { //property search 
  var page = limit * page;
  let whereArr = {};
  const { propertyStateAddress, propertyCityAddress, propertyLocalityAddress, projectSpecilization, propertyType, distressSale, stageOfConstruction, area_min,
    area_max, plotAreaUnit, price_min, price_max, floor, facingType, apartmentFurnishing, facingDirection, developer, project } = req.body;

  propertyStateAddress && (whereArr['propertyStateAddress'] = { $in: propertyStateAddress });
  propertyCityAddress && (whereArr['propertyCityAddress'] = { $in: propertyCityAddress });
  propertyLocalityAddress && (whereArr['propertyLocalityAddress'] = { $in: propertyLocalityAddress });
  projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
  propertyType && (whereArr['propertyType'] = { $in: propertyType });
  developer && (whereArr['developeName'] = { $in: developer });
  project && (whereArr['projectName'] = { $in: project });

  if (distressSale == true || distressSale == false) { whereArr['distressSale'] = distressSale; }
  stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });

  if (area_min && area_max) {
    whereArr['plotAreaVal'] = { $gte: area_min, $lte: area_max }
  }
  plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
  if (price_min && price_max) {
    whereArr['price'] = { $gte: price_min, $lte: price_max }
  }
  if (floor == 1) {
    whereArr['topFloorProperty'] = true;
  }

  if (floor == 2) { whereArr['groundFloorProperty'] = true; }

  facingType && (whereArr['facingType'] = { $in: facingType });
  apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
  facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });

  return await property.aggregate([
    {
      '$lookup': {
        'from': 'brokers',
        'localField': 'brokerId',
        'foreignField': '_id',
        'as': 'brokerData'
      }
    },
    {
      '$unwind': {
        'path': '$brokerData',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$lookup': {
        'from': 'follows',
        'localField': 'brokerId',
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
    {
      '$lookup': {
        'from': 'propertydevelopers',
        'localField': 'propertyDeveloperId',
        'foreignField': '_id',
        'as': 'developerInfo'
      }
    },
    {
      '$unwind': {
        'path': '$developerInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'propertyprojects',
        'localField': 'propertyProjectId',
        'foreignField': '_id',
        'as': 'projectInfo'
      }
    },
    {
      '$unwind': {
        'path': '$projectInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$project': {
        '_id': 1,
        'propertyImage': 1,
        'unitType': 1,
        'companyName': 1,
        'constructedAreaVal': 1,
        'plotAreaVal': 1,
        'constructedAreaUnit': 1,
        'plotAreaUnit': 1,
        'propertyStateAddress': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'commission': { $cond: { if: { $eq: ["$brokerData.isProfileVerify", true] }, then: '$commission', else: null } },
        'chooseCategory': 1,
        'propertyNature': 1,
        'propertyType': 1,
        'stageOfConstruction': 1,
        'followerCount': 1,
        'brokerData.profileImage': 1,
        'brokerData.fullName': 1,
        'brokerData.isProfileVerify': 1,
        'brokerData.dealLocality': 1,
        'distressSale': 1,
        'facingType': 1,
        'apartmentFurnishing': 1,
        'facingDirection': 1,
        'createdAt': 1,
        'topFloorProperty': 1,
        'groundFloorProperty': 1,
        'selector': '$brokerData.selector',
        'developeName': '$developerInfo.developeName',
        'projectName': '$projectInfo.projectName',
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


}



/**
 * @author - atul singh chauhan
 * @fetchPropertyLocation - Fetch Property Location
 * @param {*} req 
 * @returns 
 */
module.exports.fetchPropertyLocation = async (req) => {
  const { locality } = req.query;

  var aggregateQuery1 = [

    {
      '$project': {
        'propertyStateAddress': 1
      }
    },
    {
      '$sort': { '_id': -1 }
    },];
  if (locality) {
    aggregateQuery1.push({
      '$match': {
        propertyStateAddress: { '$regex': new RegExp(locality.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }

      }
    }
    )
  }
  var aggregateQuery2 = [

    {
      '$project': {
        'propertyCityAddress': 1
      }
    },
    {
      '$sort': { '_id': -1 }
    },];
  if (locality) {
    aggregateQuery2.push({
      '$match': {
        '$or': [
          {
            propertyCityAddress: { '$regex': new RegExp(locality.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          }
        ]
      }
    }
    )
  }
  var aggregateQuery3 = [

    {
      '$project': {
        'propertyLocalityAddress': 1
      }
    },
    {
      '$sort': { '_id': -1 }
    },];
  if (locality) {
    aggregateQuery3.push({
      '$match': {
        '$or': [
          {
            propertyLocalityAddress: { '$regex': new RegExp(locality.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
          }]
      }
    }
    )
  }
  const a = await property.aggregate(aggregateQuery1);
  const uniqueIds1 = [];

  const unique1 = a.filter(element => {
    const isDuplicate = uniqueIds1.includes(element.propertyStateAddress);

    if (!isDuplicate) {
      uniqueIds1.push(element.propertyStateAddress);

      return true;
    }

    return false;
  });
  const b = await property.aggregate(aggregateQuery2);
  const uniqueIds2 = [];

  const unique2 = b.filter(element => {
    const isDuplicate = uniqueIds2.includes(element.propertyCityAddress);

    if (!isDuplicate) {
      uniqueIds2.push(element.propertyCityAddress);

      return true;
    }

    return false;
  });

  const c = await property.aggregate(aggregateQuery3);

  const uniqueIds3 = [];

  const unique3 = c.filter(element => {
    const isDuplicate = uniqueIds3.includes(element.propertyLocalityAddress);

    if (!isDuplicate) {
      uniqueIds3.push(element.propertyLocalityAddress);

      return true;
    }

    return false;
  });

  let res;
  res = [...unique1, ...unique2, ...unique3];
  return res;
}


/**
 * @author - atul singh chauhan
 * @fetchApartment - fetchApartment based on city and locality
 * @param {*} req 
 * @returns 
 */
module.exports.filterPropertyData = async (req, limit, page) => {
  var page = limit * page;
  let whereArr = {};
  const { projectSpecilization, propertyType, distressSale, stageOfConstruction, area_min, developer, project,
    area_max, plotAreaUnit, price_min, price_max, floor, facingType, apartmentFurnishing, facingDirection } = req.body;

  projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
  propertyType && (whereArr['propertyType'] = { $in: propertyType });
  developer && (whereArr['developeName'] = { $in: developer });
  project && (whereArr['projectName'] = { $in: project });

  if (distressSale == true || distressSale == false) { whereArr['distressSale'] = distressSale; }
  stageOfConstruction && (whereArr['stageOfConstruction'] = { $in: stageOfConstruction });
  if (area_min && area_max) {
    whereArr['plotAreaVal'] = { $gte: area_min, $lte: area_max }
  }
  plotAreaUnit && (whereArr['plotAreaUnit'] = { $eq: plotAreaUnit });
  if (price_min && price_max) {
    whereArr['price'] = { $gte: price_min, $lte: price_max }
  }
  if (floor == 1) {

    whereArr['topFloorProperty'] = true;
  }
  if (floor == 2) { whereArr['groundFloorProperty'] = true; }
  facingType && (whereArr['facingType'] = { $in: facingType });
  apartmentFurnishing && (whereArr['apartmentFurnishing'] = { $in: apartmentFurnishing });
  facingDirection && (whereArr['facingDirection'] = { $in: facingDirection });
  return await property.aggregate([
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
      '$lookup': {
        'from': 'propertydevelopers',
        'localField': 'propertyDeveloperId',
        'foreignField': '_id',
        'as': 'developerInfo'
      }
    },
    {
      '$unwind': {
        'path': '$developerInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$lookup': {
        'from': 'propertyprojects',
        'localField': 'propertyProjectId',
        'foreignField': '_id',
        'as': 'projectInfo'
      }
    },
    {
      '$unwind': {
        'path': '$projectInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      '$project': {
        '_id': 1,
        'propertyImage': 1,
        'unitType': 1,
        'companyName': 1,
        'constructedAreaVal': 1,
        'plotAreaVal': 1,
        'constructedAreaUnit': 1,
        'plotAreaUnit': 1,
        'propertyStateAddress': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'commission': { $cond: { if: { $eq: ["$brokerData.isProfileVerify", true] }, then: '$commission', else: null } },
        'chooseCategory': 1,
        'propertyNature': 1,
        'propertyType': 1,
        'stageOfConstruction': 1,
        'followerCount': 1,
        'brokerData.profileImage': 1,
        'brokerData.fullName': 1,
        'brokerData.isProfileVerify': 1,
        'brokerData.dealLocality': 1,
        'distressSale': 1,
        'facingType': 1,
        'apartmentFurnishing': 1,
        'facingDirection': 1,
        'createdAt': 1,
        'topFloorProperty': 1,
        'groundFloorProperty': 1,
        'selector': '$brokerData.selector',
        'developeName': '$developerInfo.developeName',
        'projectName': '$projectInfo.projectName',
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
}

/**
 * @author - atul singh chauhan
 * @addPropertyInPrimeListing - add Property In Prime Listing 
 * @param {*} Id 
 * @returns 
 */
module.exports.addPropertyInPrimeListing = async (Id) => {
  return await property.findOneAndUpdate({
    _id: ObjectId(Id)
  }, {
    propertyAsPrimeListing: true
  }).lean();
}

/**
 * @author - atul singh chauhan
 * @fetchAllPrimeListingProperty - fetch All Prime Listing Property
 * @param {*} perPage 
 * @param {*} page 
 * @returns 
 */
module.exports.fetchAllPrimeListingProperty = async (limit, page) => {
  var page = limit * page;
  return await property.aggregate([
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
        'propertyImage': 1,
        'unitType': 1,
        'companyName': 1,
        'constructedAreaVal': 1,
        'plotAreaVal': 1,
        'constructedAreaUnit': 1,
        'plotAreaUnit': 1,
        'propertyCityAddress': 1,
        'propertyLocalityAddress': 1,
        'price': 1,
        'commission': { $cond: { if: { $eq: ["$brokerData.isProfileVerify", true] }, then: '$commission', else: null } },
        'chooseCategory': 1,
        'propertyNature': 1,
        'propertyAsPrimeListing': 1,
        'followerCount': 1,
        'brokerData.profileImage': 1,
        'brokerData.fullName': 1,
        'brokerData.isProfileVerify': 1,
        'brokerData.dealLocality': 1
      }
    }, {
      '$match': {
        'propertyAsPrimeListing': true
      }
    },
    {
      '$sort': { 'createdAt': -1 }
    },
    { '$skip': page },
    { '$limit': limit }

  ]

  );
}

/**
 * @author - atul singh chauhan
 * @filterBrokerData - Filter Broker Data
 * @param {*} req 
 * @returns 
 */
module.exports.filterBrokerData = async (req, limit, page) => {
  var page = parseInt(limit * page);
  var limit = parseInt(limit);
  let whereArr = {};
  const { interestCity, dealLocality, intrestState, dealIn, propertyNature, specializationSubType,
    projectSpecilization, developer, project } = req.body;
  intrestState && (whereArr['intrestState'] = { $eq: intrestState });
  interestCity && (whereArr['interestCity'] = { $eq: interestCity });
  dealLocality && (whereArr['dealLocality'] = { $eq: dealLocality });
  dealIn && (whereArr['dealIn'] = { $in: dealIn });
  propertyNature && (whereArr['chooseCategory'] = { $in: propertyNature });
  projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
  specializationSubType && (whereArr['specializationSubType'] = { $in: specializationSubType });
  developer && (whereArr['developeName'] = { $in: developer });
  project && (whereArr['projectName'] = { $in: project });

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
        '$lookup': {
          'from': 'follows',
          'localField': '_id',
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
        '$unwind': {
          'path': '$result',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$lookup': {
          'from': 'propertydevelopers',
          'localField': 'developerId',
          'foreignField': '_id',
          'as': 'developerInfo'
        }
      },
      {
        '$unwind': {
          'path': '$developerInfo',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$lookup': {
          'from': 'propertyprojects',
          'localField': 'projectId',
          'foreignField': '_id',
          'as': 'projectInfo'
        }
      },
      {
        '$unwind': {
          'path': '$projectInfo',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$project': {
          '_id': 1,
          'officeLocality': 1,
          'isSuper': 1,
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



/**
 * @author - atul singh chauhan
 * @topBroker - Filter Broker Data
 * @param {*} req 
 * @returns 
 */
module.exports.ShowTopBroker = async (req, limit, page) => {
  var page = parseInt(limit * page);
  var limit = parseInt(limit);
  let whereArr = {};
  req.user.interestCity && (whereArr['interestCity'] = { $in: req.user.interestCity });
  return await broker.aggregate(
    [
      {
        '$lookup': {
          'from': 'follows',
          'localField': '_id',
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
          'fullName': 1,
          'profileImage': 1,
          'followerCount': 1,
          'dealLocality': 1,
          'interestCity': 1
        }
      },
      {
        '$match': whereArr
      },
      {
        '$sort': {
          'followerCount': -1
        }
      },
      { '$skip': page },
      { '$limit': limit }
    ]
  );
}



/**
 * @author - atul singh chauhan
 * @fetecTopBroker - fetec Top Broker based on follower 
 * @param {*} req 
 * @returns 
 */
module.exports.fetecTopBroker = async (req, limit, page) => {
  var page = parseInt(limit * page);
  var limit = parseInt(limit);
  let whereArr = {};
  const { brokerName, interestCity, dealLocality, intrestState, dealIn, propertyNature,
    specializationSubType, projectSpecilization, developer, project } = req.query;
  brokerName && (whereArr['fullName'] = { $regex: new RegExp(RegExp.escape(brokerName), 'i') });
  intrestState && (whereArr['intrestState'] = { $in: intrestState });
  interestCity && (whereArr['interestCity'] = { $in: interestCity });
  dealLocality && (whereArr['dealLocality'] = { $in: dealLocality });
  dealIn && (whereArr['dealIn'] = { $in: dealIn });
  propertyNature && (whereArr['chooseCategory'] = { $in: propertyNature });
  projectSpecilization && (whereArr['selector'] = { $in: projectSpecilization });
  specializationSubType && (whereArr['specializationSubType'] = { $in: specializationSubType });
  developer && (whereArr['developeName'] = { $in: developer });
  project && (whereArr['projectName'] = { $in: project });

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
        '$lookup': {
          'from': 'follows',
          'localField': '_id',
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
        '$unwind': {
          'path': '$result',
          'preserveNullAndEmptyArrays': false
        }
      },
      {
        '$lookup': {
          'from': 'propertydevelopers',
          'localField': 'developerId',
          'foreignField': '_id',
          'as': 'developerInfo'
        }
      },
      {
        '$unwind': {
          'path': '$developerInfo',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$lookup': {
          'from': 'propertyprojects',
          'localField': 'projectId',
          'foreignField': '_id',
          'as': 'projectInfo'
        }
      },
      {
        '$unwind': {
          'path': '$projectInfo',
          'preserveNullAndEmptyArrays': true
        }
      },
      {
        '$project': {
          '_id': 1,
          'officeLocality': 1,
          'isSuper': 1,
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


/**
 * @author - atul singh chauhan
 * @fetecTopBroker - fetec Top Broker based on follower 
 * @param {*} req 
 * @returns 
 */
module.exports.fetecbroker = async (req, limit, page) => {
  // var page = limit * page;
  const { searchValue } = req.query;

  var aggregateQuery1 = [
    {
      '$match': { 'country_id': 101 }
    },
    {
      '$project': {
        'id': 1,
        'state': '$name',
        'country_id': 1,
      }
    }
  ];

  if (searchValue) {
    aggregateQuery1.push(
      {
        '$match': {
          state: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
        },
      }
    )
  }
  aggregateQuery1.push(
    {
      '$sort': { 'state': 1 }
    },
    // { '$skip': page },
    // { '$limit': limit }
  );

  var aggregateQuery2 = [
    {
      '$match': { 'country_id': 101 }
    },
    {
      '$project': {
        'id': 1,
        'city': '$name',
        'country_id': 1,
        'state_id': 1,
      }
    }
  ];

  if (searchValue) {
    aggregateQuery2.push(
      {
        '$match': {
          city: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
        },
      }
    )
  }
  aggregateQuery2.push(
    {
      '$sort': { 'city': 1 }
    },
    // { '$skip': page },
    // { '$limit': limit }
  );

  var aggregateQuery3 = [
    {
      '$project': {
        '_id': 1,
        'locality': '$Name',
        'stateId': 1,
        'cityId': 1,
      }
    }
  ];

  if (searchValue) {
    aggregateQuery3.push(
      {
        '$match': {
          locality: { '$regex': new RegExp(searchValue.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
        },
      }
    )
  }

  aggregateQuery3.push(
    {
      '$sort': { 'locality': 1 }
    },
    // { '$skip': page },
    // { '$limit': limit }
  );
  const res1 = await state.aggregate(aggregateQuery1)
  const uniqueIds1 = [];

  const unique1 = res1.filter(element => {
    const isDuplicate = uniqueIds1.includes(element.state);

    if (!isDuplicate) {
      uniqueIds1.push(element.state);

      return true;
    }

    return false;
  });
  const res2 = await city.aggregate(aggregateQuery2)
  const uniqueIds2 = [];

  const unique2 = res2.filter(element => {
    const isDuplicate = uniqueIds2.includes(element.city);

    if (!isDuplicate) {
      uniqueIds2.push(element.city);

      return true;
    }

    return false;
  });

  const res3 = await locality.aggregate(aggregateQuery3)

  const uniqueIds3 = [];

  const unique3 = res3.filter(element => {
    const isDuplicate = uniqueIds3.includes(element.locality);

    if (!isDuplicate) {
      uniqueIds3.push(element.locality);

      return true;
    }

    return false;
  });

  let res;
  res = [...unique1, ...unique2, ...unique3];
  // console.log(unique2.length);
  return res;
}

/**
 * @author - atul singh chauhan
 * @fetchDeveloperAndPropertyFilter - Fetch Developer And Property Filter
 * @param {*} req 
 * @returns 
 */
module.exports.fetchDeveloperAndPropertyFilter = async (req) => {
  const { developerOrProject, developer, project } = req.query;
  if (developer) {
    var aggregateQuery = [{
      '$match': {
        'isActive': true,
      }
    },
    {
      '$project': {
        '_id': 1,
        'developeName': 1,
        'state': '$developeHeadquaterLocation.state',
        'city': '$developeHeadquaterLocation.city',
        'locality': '$developeHeadquaterLocation.locality'

      }
    },
    {
      '$sort': { '_id': -1 }
    },];
    if (developerOrProject) {
      aggregateQuery.push({
        '$match': {

          developeName: { '$regex': new RegExp(developerOrProject.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }

        }
      },
      )
    }
    return await propertyDeveloper.aggregate(aggregateQuery);
  }
  else if (project) {
    var aggregatequery = [
      {
        '$match': {
          'isActive': true,
        }
      }, {
        '$project': {
          '_id': 1,
          'projectName': 1,
          'state': '$projectLocation.state',
          'city': '$projectLocation.city',
          'locality': '$projectLocation.locality'
        }
      },
      {
        '$sort': { '_id': -1 }
      },];
    if (developerOrProject) {
      aggregatequery.push({
        '$match': {
          projectName: { '$regex': new RegExp(developerOrProject.toLowerCase().replace(/\s+/g, '\\s+'), 'gi') }
        }
      },
      )
    }
    return await propertyproject.aggregate(aggregatequery);
  }
}

/**
 * @author - atul singh chauhan
 * @fetecBroker - Fetec Broker
 * @param {*} req 
 * @returns 
 */
module.exports.fetecBroker = async (req, page, limit) => {
  var page = limit * page;
  var whereArr = {};
  if (req.body.brokerType == "all_broker") {
    (whereArr['isActive'] = false);
  }
  else if (req.body.brokerType == "verified") {
    (whereArr['isProfileVerify'] = true);
  }
  else if (req.body.brokerType == "unverified") {
    (whereArr['isProfileVerify'] = false);
  }
  else if (req.body.brokerType == "super_broker") {
    (whereArr['isSuper'] = true);
  }

  return await broker.aggregate(
    [
      {
        '$lookup': {
          'from': 'properties',
          'localField': '_id',
          'foreignField': 'brokerId',
          'as': 'result'
        }
      }
      , {
        '$addFields': {
          'propertyCount': {
            '$size': '$result'
          }
        }
      },
      {
        '$project': {
          '_id': '$_id',
          'fullName': '$fullName',
          'officeCity': '$officeCity',
          'mobile': '$mobile',
          'expertise': '$expertise',
          'createdAt': '$createdAt',
          'propertyCount': '$propertyCount',
          'createdAt': 1,
          'isActive': 1,
          'isProfileVerify': 1,
          'isSuper': 1
        }
      }
      ,
      {
        '$match': whereArr
      },
      { '$skip': page },
      { '$limit': limit }
    ]

  );
}



/**
 * @author - atul singh chauhan
 * @addPropertyInPrimeListing - news Feed Report
 * @param {*} req
 * @returns 
 */
module.exports.addNewsFeedReport = async (req) => {
  const propertyData = new propertyReport({
    propertyId: req.body.propertyId,
    brokerId: req.body.brokerId,
    report: req.body.report,
  });
  return await propertyData.save();

}


/**
 * @author - atul singh chauhan
 * @featchPropertyReport - Featch Property Report
 * @param {*} perPage 
 * @param {*} page 
 * @returns 
 */
module.exports.featchPropertyReport = async (limit, page) => {
  var page = limit * page;
  return await propertyReport.aggregate(
    [
      {
        '$lookup': {
          'from': 'properties',
          'localField': 'propertyId',
          'foreignField': '_id',
          'as': 'propertyData'
        }
      }, {
        '$unwind': {
          'path': '$propertyData',
          'preserveNullAndEmptyArrays': false
        }
      }, {
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
      },
      { '$skip': page },
      { '$limit': limit }
    ]

  );

}


/**
 * @author - atul singh chauhan
 * @updatePropertyImageFlag - Update Property Image Flag
 * @param {*} req
 * @returns 
 */
module.exports.updatePropertyImageFlag = async (propertyData) => {
  propertyData.propertyImage.verifiedflag = req.body.verifiedflag ? req.body.verifiedflag : propertyData.propertyImage.verifiedflag;
  return await propertyData.save();

}


/**
 * @author - atul singh chauhan
 * @editProperty - Edit Property Data
 * @param {*} req
 * @returns 
 */
module.exports.updateProperty = async (req, propertyData) => {
  console.log(req.body.plotAreaUnit, req.body.plotAreaVal);
  var plotArea = plotAreaInitialisation(req.body.plotAreaUnit, req.body.plotAreaVal);
  var constructedArea = constructedAreaInitialisation(req.body.constructedAreaUnit, req.body.constructedAreaVal);
  propertyData.propertyImage = req.body.propertyImage ? req.body.propertyImage : propertyData.propertyImage;
  propertyData.propertyProjectId = req.body.propertyProjectId ? req.body.propertyProjectId : propertyData.propertyProjectId;
  propertyData.propertyDeveloperId = req.body.propertyDeveloperId ? req.body.propertyDeveloperId : propertyData.propertyDeveloperId;
  propertyData.propertyNature = req.body.propertyNature ? req.body.propertyNature : propertyData.propertyNature;
  propertyData.chooseCategory = req.body.chooseCategory ? req.body.chooseCategory : propertyData.chooseCategory;
  propertyData.commission = req.body.commission ? req.body.commission : propertyData.commission;
  propertyData.propertyLocalityAddress = req.body.propertyLocalityAddress ? req.body.propertyLocalityAddress : propertyData.propertyLocalityAddress;
  propertyData.propertyStateAddress = req.body.propertyStateAddress ? req.body.propertyStateAddress : propertyData.propertyStateAddress;
  propertyData.propertyCityAddress = req.body.propertyCityAddress ? req.body.propertyCityAddress : propertyData.propertyCityAddress;
  propertyData.constructedAreaVal = req.body.constructedAreaVal ? req.body.constructedAreaVal : propertyData.constructedAreaVal;
  propertyData.plotAreaVal = req.body.plotAreaVal ? req.body.plotAreaVal : propertyData.plotAreaVal;
  propertyData.plotAreaUnit = req.body.plotAreaUnit ? req.body.plotAreaUnit : propertyData.plotAreaUnit;
  propertyData.constructedAreaUnit = req.body.constructedAreaUnit ? req.body.constructedAreaUnit : propertyData.constructedAreaUnit;
  propertyData.propertyType = req.body.propertyType ? req.body.propertyType : propertyData.propertyType;
  propertyData.unitType = req.body.unitType ? req.body.unitType : propertyData.unitType;
  propertyData.description = req.body.description ? req.body.description : propertyData.description;
  // propertyData.totalFloor = req.body.totalFloor ? req.body.totalFloor : propertyData.totalFloor;
  propertyData.floorNo = req.body.floorNo ? req.body.floorNo : propertyData.floorNo;
  if (req.body.topFloorProperty == true || req.body.topFloorProperty == false)
    propertyData.topFloorProperty = req.body.topFloorProperty;
  if (req.body.groundFloorProperty == true || req.body.groundFloorProperty == false)
    propertyData.groundFloorProperty = req.body.groundFloorProperty;
  if (req.body.negotiable == true || req.body.negotiable == false)
    propertyData.negotiable = req.body.negotiable;
  if (req.body.distressSale == true || req.body.distressSale == false)
    propertyData.distressSale = req.body.distressSale;
  propertyData.price = req.body.price ? req.body.price : propertyData.price;
  propertyData.otherCharge = req.body.otherCharge ? req.body.otherCharge : propertyData.otherCharge;
  propertyData.apartmentFurnishing = req.body.apartmentFurnishing ? req.body.apartmentFurnishing : propertyData.apartmentFurnishing;
  propertyData.additionalFacilities = req.body.additionalFacilities ? req.body.additionalFacilities : propertyData.additionalFacilities;
  propertyData.facingType = req.body.facingType ? req.body.facingType : propertyData.facingType;
  propertyData.facingDirection = req.body.facingDirection ? req.body.facingDirection : propertyData.facingDirection;
  propertyData.stageOfConstruction = req.body.stageOfConstruction ? req.body.stageOfConstruction : propertyData.stageOfConstruction;
  propertyData.uspDescription = req.body.uspDescription ? req.body.uspDescription : propertyData.uspDescription;
  propertyData.ownershipType = req.body.ownershipType ? req.body.ownershipType : propertyData.ownershipType;
  propertyData.frontUnit = req.body.frontUnit ? req.body.frontUnit : propertyData.frontUnit;
  propertyData.frontAreaVal = req.body.frontAreaVal ? req.body.frontAreaVal : propertyData.frontAreaVal;
  propertyData.depthUnit = req.body.depthUnit ? req.body.depthUnit : propertyData.depthUnit;
  propertyData.depthAreaVal = req.body.depthAreaVal ? req.body.depthAreaVal : propertyData.depthAreaVal;
  propertyData.roadInFrontUnit = req.body.roadInFrontUnit ? req.body.roadInFrontUnit : propertyData.roadInFrontUnit;
  propertyData.roadInFrontVal = req.body.roadInFrontVal ? req.body.roadInFrontVal : propertyData.roadInFrontVal;
  propertyData.cornerPloat = req.body.cornerPloat ? req.body.cornerPloat : propertyData.cornerPloat;
  propertyData.status = req.body.status ? req.body.status : propertyData.status;
  propertyData.sizes = req.body.sizes ? req.body.sizes : propertyData.sizes;
  propertyData.listingTillDate = req.body.listingTillDate ? req.body.listingTillDate : propertyData.listingTillDate;
  propertyData.propertyAge = req.body.propertyAge ? req.body.propertyAge : propertyData.propertyAge;
  propertyData.leasedTo = req.body.leasedTo ? req.body.leasedTo : propertyData.leasedTo;
  propertyData.brand = req.body.brand ? req.body.brand : propertyData.brand;
  propertyData.pdf = req.body.pdf ? req.body.pdf : propertyData.pdf;
  propertyData.pdfFileName = req.body.pdfFileName ? req.body.pdfFileName : propertyData.pdfFileName;
  propertyData.parkingFacilities = req.body.parkingFacilities ? req.body.parkingFacilities : propertyData.parkingFacilities;
  propertyData.totalFloorBuilt = req.body.totalFloorBuilt ? req.body.totalFloorBuilt : propertyData.totalFloorBuilt;
  propertyData.directOwnerTouch = req.body.directOwnerTouch ? req.body.directOwnerTouch : propertyData.directOwnerTouch;
  propertyData.vancatPreleased = req.body.vancatPreleased ? req.body.vancatPreleased : propertyData.vancatPreleased;
  propertyData.groundCoverage = req.body.groundCoverage ? req.body.groundCoverage : propertyData.groundCoverage;
  propertyData.propertyOnFloor = req.body.propertyOnFloor ? req.body.propertyOnFloor : propertyData.propertyOnFloor;
  propertyData.heightVal = req.body.heightVal ? req.body.heightVal : propertyData.heightVal;
  propertyData.heightUnit = req.body.heightUnit ? req.body.heightUnit : propertyData.heightUnit;
  propertyData.propertyManagedBy = req.body.propertyManagedBy ? req.body.propertyManagedBy : propertyData.propertyManagedBy;
  propertyData.totalConstructedFloorInProperty = req.body.totalConstructedFloorInProperty ? req.body.totalConstructedFloorInProperty : propertyData.totalConstructedFloorInProperty;
  propertyData.maintenaceExtra = req.body.maintenaceExtra ? req.body.maintenaceExtra : propertyData.maintenaceExtra;
  propertyData.GivenTo = req.body.GivenTo ? req.body.GivenTo : propertyData.GivenTo;
  propertyData.space = req.body.space ? req.body.space : propertyData.space;
  propertyData.Occupancy = req.body.Occupancy ? req.body.Occupancy : propertyData.Occupancy;

  if (req.body.plotAreaVal) {
    propertyData.plotArea.SQFT = plotArea.plotArea.SQFT;
    propertyData.plotArea.SQMT = plotArea.plotArea.SQMT;
    propertyData.plotArea.SQYD = plotArea.plotArea.SQYD;
    propertyData.plotArea.Bigha = plotArea.plotArea.Bigha;
    propertyData.plotArea.Marla = plotArea.plotArea.Marla;
    propertyData.plotArea.Katha = plotArea.plotArea.Katha;
    propertyData.plotArea.Acers = plotArea.Acers;
  } else {
    propertyData.plotArea.SQFT = propertyData.plotArea.SQFT;
    propertyData.plotArea.SQMT = propertyData.plotArea.SQMT;
    propertyData.plotArea.SQYD = propertyData.plotArea.SQYD;
    propertyData.plotArea.Bigha = propertyData.plotArea.Bigha;
    propertyData.plotArea.Marla = propertyData.plotArea.Marla;
    propertyData.plotArea.Katha = propertyData.plotArea.Katha;
    propertyData.plotArea.Acers = propertyData.Acers;
  }
  if (req.body.constructedAreaVal) {
    propertyData.constructedArea.SQFT = constructedArea.constructedArea.SQFT;
    propertyData.constructedArea.SQMT = constructedArea.constructedArea.SQMT;
    propertyData.constructedArea.SQYD = constructedArea.constructedArea.SQYD;
    propertyData.constructedArea.Bigha = constructedArea.constructedArea.Bigha;
    propertyData.constructedArea.Marla = constructedArea.constructedArea.Marla;
    propertyData.constructedArea.Katha = constructedArea.constructedArea.Katha;
    propertyData.constructedArea.Acers = constructedArea.constructedArea.Acers;
  } else {
    propertyData.constructedArea.SQFT = propertyData.constructedArea.SQFT;
    propertyData.constructedArea.SQMT = propertyData.constructedArea.SQMT;
    propertyData.constructedArea.SQYD = propertyData.constructedArea.SQYD;
    propertyData.constructedArea.Bigha = propertyData.constructedArea.Bigha;
    propertyData.constructedArea.Marla = propertyData.constructedArea.Marla;
    propertyData.constructedArea.Katha = propertyData.constructedArea.Katha;
    propertyData.constructedArea.Acers = propertyData.constructedArea.Acers;
  }

  return await propertyData.save();

}


/**
 * @author - atul singh chauhan
 * @removeProperty - Remove Property
 * @param {*} req
 * @returns 
 */
module.exports.removeProperty = async (id) => {
  return await property.findByIdAndUpdate(id, { isActive: false });

}


/**
 * @author - atul singh chauhan
 * @removeReviewProperty - Remove Review Property
 * @param {*} req
 * @returns 
 */
module.exports.removeReviewProperty = async (id) => {
  return await reView.findByIdAndUpdate(id, { isActive: false });
}


/**
 * @author - atul singh chauhan
 * @removeCallRequestProperty - Remove Call Request Property
 * @param {*} req
 * @returns 
 */
module.exports.removeCallRequestProperty = async (id) => {
  return await callRequest.deleteMany(
    { propertyId: id }
  );
}



/**
 * @author - atul singh chauhan
 * @removeBookMarkProperty - Remove BookMark Property
 * @param {*} req
 * @returns 
 */
module.exports.removeBookMarkProperty = async (id) => {
  return await propertyBookMark.findByIdAndUpdate(id, { isActive: false });
}

/**
 * @author - atul singh chauhan
 * @removeFlagProperty - removeFlagProperty
 * @param {*} req
 * @returns 
 */
module.exports.removeFlag = async (id) => {
  return await flagProperty.findByIdAndUpdate(id, { isActive: false });
}


/**
 * @author - atul singh chauhan
 * @removeReportProperty - Remove report  Property
 * @param {*} req
 * @returns 
 */
module.exports.removeReportProperty = async (id) => {
  return await propertyReport.findByIdAndUpdate(id, { isActive: false });
}



/**
 * @author - atul singh chauhan
 * @removeSaveProperty - Remove save Property
 * @param {*} req
 * @returns 
 */
module.exports.removeSaveProperty = async (req) => {
  await saveProperty.findByIdAndUpdate(id, { isActive: false });

}


/**
 * @author - atul singh chauhan
 * @featchNewsFeed - Featch News Feed
 * @param {*} req
 * @returns 
 */
module.exports.featchNewsFeed = async (req, limit, page) => {
  var page = limit * page;
  let res1 = await property.aggregate([
    {
      $match: { isActive: true, propertyAsHotDeal: false, propertyAsPrimeListing: false, isSold: false }
    },
    {
      '$lookup': {
        'from': 'brokers',
        'localField': 'brokerId',
        'foreignField': '_id',
        'as': 'brokerData'
      }
    },
    {
      '$unwind': {
        'path': '$brokerData',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$lookup': {
        'from': 'follows',
        'localField': 'brokerId',
        'foreignField': 'followFor',
        'as': 'followData'
      }
    },
    {
      '$unwind': {
        'path': '$followData',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$lookup': {
        'from': 'propertyprojects',
        'localField': 'propertyProjectId',
        'foreignField': '_id',
        'as': 'projectInfo'
      }
    },
    {
      '$unwind': {
        'path': '$projectInfo',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$project': {
        'brokerId': 1,
        'plotAreaUnit': 1,
        'plotAreaVal': 1,
        'price': 1,
        'unitType': 1,
        'propertyImage': 1,
        'profileImage': '$brokerData.profileImage',
        'brokerName': '$brokerData.fullName',
        'group': '$brokerData.group',
        'isSuper': '$brokerData.isSuper',
        'commission': {
          '$cond': {
            'if': {
              '$eq': [
                req.user.isProfileVerify, true
              ]
            },
            'then': '$commission',
            'else': null
          }
        },
        'followTo': '$followData.followTo',
        'propertyAsHotDeal': 1,
        'propertyAsPrimeListing': 1,
        'isSold': 1,
        'propertyCityAddress': 1,
        "propertyLocalityAddress": 1,
        "propertyStateAddress": 1,
        'createdAt': 1,
        'projectName': '$projectInfo.projectName',
      }
    },
    {
      '$match': {
        '$or': [
          {
            'followTo': new ObjectId(req.user._id)
          }
        ],


      },

    },
    {
      '$sort': {
        'createdAt': -1
      }
    },
    { '$skip': page },
    { '$limit': limit }
  ]
  );

  let res2 = await property.aggregate([
    {
      $match: { isActive: true, propertyAsHotDeal: false, propertyAsPrimeListing: false, isSold: false }
    },
    {
      '$lookup': {
        'from': 'brokers',
        'localField': 'brokerId',
        'foreignField': '_id',
        'as': 'brokerData'
      }
    },
    {
      '$unwind': {
        'path': '$brokerData',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$lookup': {
        'from': 'propertyprojects',
        'localField': 'propertyProjectId',
        'foreignField': '_id',
        'as': 'projectInfo'
      }
    },
    {
      '$unwind': {
        'path': '$projectInfo',
        'preserveNullAndEmptyArrays': false
      }
    },
    {
      '$project': {
        'brokerId': 1,
        'plotAreaUnit': 1,
        'plotAreaVal': 1,
        'price': 1,
        'unitType': 1,
        'propertyImage': 1,
        'profileImage': '$brokerData.profileImage',
        'brokerName': '$brokerData.fullName',
        'group': '$brokerData.group',
        'isSuper': '$brokerData.isSuper',
        'commission': {
          '$cond': {
            'if': {
              '$eq': [
                req.user.isProfileVerify, true
              ]
            },
            'then': '$commission',
            'else': null
          }
        },
        'propertyAsHotDeal': 1,
        'propertyAsPrimeListing': 1,
        'isSold': 1,
        'propertyCityAddress': 1,
        "propertyLocalityAddress": 1,
        "propertyStateAddress": 1,
        'projectName': '$projectInfo.projectName',
        'createdAt': 1,
      }
    },
    {
      '$match': {
        'group': 2
      },

    },
    {
      '$sort': {
        'createdAt': -1
      }
    },
    { '$skip': page },
    { '$limit': limit }
  ]
  );
  let res3 = await property.aggregate([
    {
      $match: { isActive: true, propertyAsHotDeal: false, propertyAsPrimeListing: false, isSold: false }
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
    },
    {
      '$project': {
        'brokerId': 1,
        'plotAreaUnit': 1,
        'plotAreaVal': 1,
        'price': 1,
        'unitType': 1,
        'propertyImage': 1,
        'profileImage': '$brokerData.profileImage',
        'brokerName': '$brokerData.fullName',
        'group': '$brokerData.group',
        'isSuper': '$brokerData.isSuper',
        'superBrokerState': '$brokerData.superBrokerState',
        'superBrokerCity': '$brokerData.superBrokerCity',
        'commission': {
          '$cond': {
            'if': {
              '$eq': [
                req.user.isProfileVerify, true
              ]
            },
            'then': '$commission',
            'else': null
          }
        },
        'propertyAsHotDeal': 1,
        'propertyAsPrimeListing': 1,
        'isSold': 1,
        'propertyCityAddress': 1,
        "propertyLocalityAddress": 1,
        "propertyStateAddress": 1,
        'createdAt': 1
      }
    },
    {
      $match: {
        '$or': [
          {
            'superBrokerState': { '$in': req.user.intrestState }
          },
          {
            'superBrokerCity': { '$in': req.user.interestCity }
          },
        ], isSuper: true
      }
    },
    {
      '$sort': {
        'createdAt': -1
      }
    },
    { '$skip': page },
    { '$limit': limit }
  ]
  );
  let res = [...res1, ...res2, ...res3];
  let response = [...new Map(res.map(item => [item._id.toString(), item])).values()];
  if (req.user.isSuper == true) { return response }
  else if (req.user.group == 2) { return response }
  else if (req.user.isProfileVerify == false) {
    response.forEach((val, index) => {
      if (val.propertyImage.length) {
        const imgData = val.propertyImage.filter((ele) => ele.verifiedflag == false)
        response[index].propertyImage = imgData
      }
    })
  }
  return response;
}



/**
 * @author - atul singh chauhan
 * @featchBrokerProperty - featch Broker Property
 * @param {*} req
 * @returns 
 */
module.exports.featchBrokerProperty = async (req, brokerId, propertyId) => {
  let res = await property.aggregate([
    {
      $match: { brokerId: ObjectId(brokerId), _id: ObjectId(propertyId), isActive: true }
    },
    {
      $lookup: {
        from: "brokers",
        localField: "brokerId",
        foreignField: "_id",
        as: "brokerInfo",
      },
    },
    { $unwind: "$brokerInfo" },
    {
      $lookup: {
        from: "follows",
        localField: "brokerInfo._id",
        foreignField: "followFor",
        as: "followerInfo",
      },
    },
    {
      $addFields: {
        followers: { $size: "$followerInfo" },
      }
    },
    {
      $lookup: {
        from: "flags",
        localField: "_id",
        foreignField: "propertyId",
        as: "propertyInfo",
      },
    },
    {
      $addFields: {
        flagCount: { $size: "$propertyInfo" },
      }
    },
    {
      $lookup: {
        from: "propertyprojects",
        localField: "propertyProjectId",
        foreignField: "_id",
        as: "projectInfo",
      },
    },
    {
      '$unwind': {
        'path': '$projectInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
    {
      $lookup: {
        from: "propertydevelopers",
        localField: "propertyDeveloperId",
        foreignField: "_id",
        as: "developerInfo",
      },
    },
    {
      '$unwind': {
        'path': '$developerInfo',
        'preserveNullAndEmptyArrays': true
      }
    },
  ]);
  if (brokerId === req.user._id.toString()) { return res; }
  else if (req.user.isSuper == true) { return res }
  else if (req.user.group == 2) { return res }
  else if (req.user.isProfileVerify == false) {
    res.forEach((val, index) => {
      if (val.propertyImage.length) {
        const imgData = val.propertyImage.filter((ele) => ele.verifiedflag == false)
        res[index].propertyImage = imgData
      }
    })
  }
  return res;
}