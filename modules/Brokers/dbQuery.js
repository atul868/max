var ObjectID = require("mongoose").Types.ObjectId
const auth = require("../../utils/auth");
const { handleAWSUpload } = require("../../config/s3");
const broker = require("./schema");
const { property } = require("../Property/schema");
const saveProperty = require("../Wishlist/schema");
const reView = require("../Review/schema");
const follow = require("../Followers/schema");
const flag = require("../Flagproperty/schema");
const { contact } = require("../common/schema");


var round = require('mongo-round');

/**
* @author - atul singh chauhan
* @findBroker - find Broker
* @param {*} req
* @returns 
*/
module.exports.findBroker = async (data) => {
    return await broker.findOne(data);
}

/**
* @author - atul singh chauhan
* @findBroker - find Broker
* @param {*} req
* @returns 
*/
module.exports.createBroker = async (createBroker) => {
    return await createBroker.save();
}

/**
* @author - atul singh chauhan
* @findBroker - create Contact
* @param {*} req
* @returns 
*/
module.exports.addContact = async (contacts) => {
    return await contact.create(contacts);
}

/**
* @author - atul singh chauhan
* @showLocality - Show Contact
* @param {*} req 
* @returns 
*/
module.exports.showContact = async (req) => {
    return await contact.find(req).lean();
}

/**
* @author - atul singh chauhan
* @removecallRequest -Remove call Request
* @param {*} req
* @returns 
*/
module.exports.createResendOpt = async (brokerData) => {
    return await brokerData.save();
}


/**
* @author - atul singh chauhan
* @verifyBrokerData - verify Broker Data
* @param {*} req
* @returns 
*/
module.exports.verifyBrokerData = async (brokerData) => {
    return await brokerData.save();
}
/**
* @author - atul singh chauhan
* @checkPhoneExist - check Phone Exist
* @param {*} req
* @returns 
*/
module.exports.checkPhoneExist = async (phoneExist) => {
    return await phoneExist.save();

}


/**
* @author - atul singh chauhan
* @addBrokerDetail -add Broker Detail
* @param {*} req
* @returns 
*/
module.exports.addBrokerDetail = async (brokerData) => {
    return await brokerData.save();
}


/**
* @author - atul singh chauhan
* @addBrokerDetail -add Broker Detail
* @param {*} req
* @returns 
*/
module.exports.createBroker = async (brokerData) => {
    return await broker.create(brokerData);
}
/**
* @author - atul singh chauhan
* @editPersonalProfileData - edit Personal Profile Data
* @param {*} req
* @returns 
*/
module.exports.editPersonalProfileData = async (brokerData) => {
    return await brokerData.save();
}
/**
* @author - atul singh chauhan
* @editProfessionalProfileData - edit Professional Profile Data
* @param {*} req
* @returns 
*/
module.exports.editProfessionalProfileData = async (brokerData) => {
    return await brokerData.save();

}


/**
* @author - atul singh chauhan
* @verifyBrokerProfile - verify Broker Profile
* @param {*} req
* @returns 
*/
module.exports.verifyBrokerProfile = async (brokerData) => {
    return await brokerData.save();
}


/**
* @author - atul singh chauhan
* @featchBrokerData - featch Broker Data
* @param {*} req
* @returns 
*/
module.exports.postedByBroker = async (req,brokerId, limit, page) => {
    var page = limit * page;
    let res= await property.aggregate([
        {
            '$match': {
                '$and': [
                    {
                        'brokerId': new ObjectID(brokerId)
                    },
                    {
                        'isActive': true
                    }
                ]
            }
        },
        {
            '$lookup': {
                'from': 'callrequests',
                'localField': '_id',
                'foreignField': 'propertyId',
                'as': 'result'
            }
        },
        {
            '$addFields': {
                'callRequestCount': {
                    '$size': '$result'
                }
            }
        },
        {
            $lookup: {
                from: "brokers",
                localField: "brokerId",
                foreignField: "_id",
                as: "brokerData",
            },
        },
        { $unwind: "$brokerData" },
        {
            $lookup: {
                from: "follows",
                localField: "brokerData._id",
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
        {
            $project: {
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
                'callRequestCount': '$callRequestCount',
                'followerCount': '$followers',


            }
        },
        {
            '$sort': { 'createdAt': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
    ]);
    if (brokerId === req.user._id.toString()) { return res;}
    if (req.user.isProfileVerify == false) {
     res.forEach((val, index) => {
          if (val.propertyImage.length) {
            const imgData = val.propertyImage.filter((ele) => ele.verifiedflag == false)
            res[index].propertyImage = imgData
          }
        })
      }
      return res;
}

/**
* @author - atul singh chauhan
* @sendCallRequest - Send Call Request
* @param {*} req
* @returns 
*/
// module.exports.featchProfile = async (brokerId) => {

//     return await broker.aggregate([
//         {
//             // $match: { $and: [{ _id: ObjectID(brokerId) }, {isRegisterd: true}] }
//             $match: { _id: ObjectID(brokerId) }
//         },
//         {
//             $lookup: {
//                 from: "properties",
//                 localField: "_id",
//                 foreignField: "brokerId",
//                 as: "propertyInfo",
//             },
//         },
//         {
//             $lookup: {
//                 from: "callrequests",
//                 localField: "_id",
//                 foreignField: "requestFor",
//                 as: "callrequestsInfo",
//             },
//         },
//         {
//             $project: {
//                 _id: 1,
//                 fullName: { $ifNull: ["$fullName", ""] },
//                 email: { $ifNull: ["$email", ""] },
//                 mobile: { $ifNull: ["$mobile", ""] },
//                 dob: { $ifNull: ["$dob", ""] },
//                 state: { $ifNull: ["$state", ""] },
//                 city: { $ifNull: ["$city", ""] },
//                 businessType: { $ifNull: ["$businessType", ""] },
//                 companyName: { $ifNull: ["$companyName", ""] },
//                 deal: { $ifNull: ["$deal", ""] },
//                 selector: { $ifNull: ["$selector", ""] },
//                 expertise: { $ifNull: ["$expertise", ""] },
//                 gstNo: { $ifNull: ["$gstNo", ""] },
//                 reraNo: { $ifNull: ["$reraNo", ""] },
//                 intrestState: { $ifNull: ["$intrestState", ""] },
//                 interestCity: { $ifNull: ["$interestCity", ""] },
//                 dealLocality: { $ifNull: ["$dealLocality", ""] },
//                 isRegisterd: { $ifNull: ["$isRegisterd", ""] },
//                 isVerified: { $ifNull: ["$isVerified", ""] },
//                 isActive: { $ifNull: ["$isActive", ""] },
//                 isDelete: { $ifNull: ["$isDelete", ""] },

//                 propertyCount: { $size: "$propertyInfo" },
//                 callrequestsCount: { $size: "$callrequestsInfo" },
//             }
//         }
//     ]);

// }


/**
* @author - atul singh chauhan
* @removecallRequest -Remove call Request
* @param {*} req
* @returns 
*/
module.exports.featchBrokerProfile = async (brokerId, req) => {
    return await broker.aggregate([
        {
            $match: { _id: ObjectID(brokerId) }
        },
        // {
        //     $lookup: {
        //         from: "reviews",
        //         localField: "_id",
        //         foreignField: "reviewFor",
        //         as: "reviewInfo",
        //     },
        // },
        // {
        //     $addFields: {
        //         reviewData: {
        //             $map: {
        //                 input: {
        //                     $filter: {
        //                         input: "$reviewInfo",
        //                         as: "reviewRow",
        //                         cond: {
        //                             $eq: [
        //                                 "$$reviewRow.isActive",
        //                                 true,
        //                             ],
        //                         },
        //                     },
        //                 },
        //                 as: "reviewData",
        //                 in: {
        //                     rating: "$$reviewData.rating",
        //                     review: "$$reviewData.review",
        //                     propertyId: "$$reviewData.propertyId",
        //                     reviewTo: "$$reviewData.reviewTo",
        //                     reviewFor: "$$reviewData.reviewFor",
        //                 },
        //             },
        //         },
        //     },
        // },
        // // { $unwind: "$reviewData" },
        // {
        //     $lookup: {
        //         from: "follows",
        //         localField: "_id",
        //         foreignField: "followFor",
        //         as: "followerInfo",
        //     },
        // },
        // {
        //     $lookup: {
        //         from: "follows",
        //         localField: "_id",
        //         foreignField: "followTo",
        //         as: "followingInfo",
        //     },
        // },
        // {
        //     $lookup: {
        //         from: "properties",
        //         localField: "_id",
        //         foreignField: "brokerId",
        //         as: "propertyInfo",
        //     },
        // },
        // {
        //     $lookup: {
        //         from: "callrequests",
        //         localField: "_id",
        //         foreignField: "requestFor",
        //         as: "callrequestsInfo",
        //     },
        // },
        // {
        //     $addFields: {
        //         averageRatingCount: round({ $avg: "$reviewData.rating" }, 1),
        //     }
        // },
        // {
        //     $addFields: {
        //         reviewCount: { $size: "$reviewData" },
        //     }
        // },
        // {
        //     $addFields: {
        //         postedPropertyCount: { $size: "$propertyInfo" },
        //     }
        // },
        // {
        //     $addFields: {
        //         followersCount: { $size: "$followerInfo" },
        //     }
        // },
        // {
        //     $addFields: {
        //         followingCount: { $size: "$followingInfo" },
        //     }
        // },
        // {
        //     $addFields: {
        //         callrequestCount: { $size: "$callrequestsInfo" },
        //     }
        // },
        // /* needed data fetch here */
        // {
        //     $project: {
        //         id: 1,
        //         fullName: { $ifNull: ["$fullName", ""] },
        //         officeState: { $ifNull: ["$officeState", ""] },
        //         officeCity: { $ifNull: ["$officeCity", ""] },
        //         officeLocality: { $ifNull: ["$officeLocality", ""] },
        //         companyName: { $ifNull: ["$companyName", ""] },
        //         dealIn: { $ifNull: ["$dealIn", ""] },
        //         intrestState: { $ifNull: ["$intrestState", ""] },
        //         interestCity: { $ifNull: ["$interestCity", ""] },
        //         dealLocality: { $ifNull: ["$dealLocality", ""] },
        //         averageRatingCount: { $ifNull: ["$averageRatingCount", 0] },
        //         reviewCount: { $ifNull: ["$reviewCount", 0] },
        //         postedPropertyCount: { $ifNull: ["$postedPropertyCount", 0] },
        //         followersCount: { $ifNull: ["$followersCount", 0] },
        //         followingCount: { $ifNull: ["$followingCount", ""] },
        //         callrequestCount: { $ifNull: ["$callrequestCount", ""] },
        //         // "propertyInfo._id": 1,
        //         // "propertyInfo.companyName": { $ifNull: ["propertyInfo.companyName", ""] },
        //     }
        // },
    ]);
}

module.exports.getBrokerCount = async (brokerId, req) => {
    return await broker.aggregate([
        {
            $match: { _id: ObjectID(brokerId) }
        },
        {
            $lookup: {
                from: "reviews",
                localField: "_id",
                foreignField: "reviewFor",
                as: "reviewInfo",
            },
        },
        {
            $addFields: {
                reviewData: {
                    $map: {
                        input: {
                            $filter: {
                                input: "$reviewInfo",
                                as: "reviewRow",
                                cond: {
                                    $eq: [
                                        "$$reviewRow.isActive",
                                        true,
                                    ],
                                },
                            },
                        },
                        as: "reviewData",
                        in: {
                            rating: "$$reviewData.rating",
                            review: "$$reviewData.review",
                            propertyId: "$$reviewData.propertyId",
                            reviewTo: "$$reviewData.reviewTo",
                            reviewFor: "$$reviewData.reviewFor",
                        },
                    },
                },
            },
        },
        // { $unwind: "$reviewData" },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followFor",
                as: "followerInfo",
            },
        },
        {
            $lookup: {
                from: "follows",
                localField: "_id",
                foreignField: "followTo",
                as: "followingInfo",
            },
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
            $lookup: {
                from: 'properties',
                as: 'soldProperty',
                let: { brokerId: '$_id' },
                pipeline: [
                    {
                        $match: {
                            $expr: {
                                $and: [
                                    { $eq: ['$brokerId', '$$brokerId'] },
                                    { $eq: ['$isSold', true] },
                                ]
                            }
                        }
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "callrequests",
                localField: "_id",
                foreignField: "requestFor",
                as: "callrequestsInfo",
            },
        },
        {
            $addFields: {
                averageRatingCount: round({ $avg: "$reviewData.rating" }, 1),
            }
        },
        {
            $addFields: {
                reviewCount: { $size: "$reviewData" },
            }
        },
        {
            $addFields: {
                postedPropertyCount: { $size: "$property" },
            }
        },
        {
            $addFields: {
                followersCount: { $size: "$followerInfo" },
            }
        },
        {
            $addFields: {
                followingCount: { $size: "$followingInfo" },
            }
        },
        {
            $addFields: {
                callrequestCount: { $size: "$callrequestsInfo" },
            }
        },
        {
            $addFields: {
                soldCount: { $size: "$soldProperty" },
            }
        },
        /* needed data fetch here */
        {
            $project: {
                id: 1,
                fullName: { $ifNull: ["$fullName", ""] },
                profileImage: { $ifNull: ["$profileImage", ""] },
                averageRatingCount: { $ifNull: ["$averageRatingCount", 0] },
                reviewCount: { $ifNull: ["$reviewCount", 0] },
                postedPropertyCount: { $ifNull: ["$postedPropertyCount", 0] },
                followersCount: { $ifNull: ["$followersCount", 0] },
                followingCount: { $ifNull: ["$followingCount", 0] },
                callrequestCount: { $ifNull: ["$callrequestCount", 0] },
                soldCount: { $ifNull: ["$soldCount", 0] },
            }
        },
    ]);
}

module.exports.brokerAllReview = async (brokerId, limit, page) => {
    var page = limit * page;
    return await broker.aggregate([
        {
            '$match': {
                '_id': new ObjectID(brokerId)
            }
        },
        {
            '$lookup': {
                'from': 'reviews',
                'localField': '_id',
                'foreignField': 'reviewFor',
                'as': 'reviewInfo'
            }
        },
        {
            '$addFields': {
                'avgReview': {
                    '$avg': '$reviewInfo.rating'
                }
            }
        },
        {
            '$addFields': {
                'countReview': { '$size': '$reviewInfo' }
            }
        },
        { $unwind: "$reviewInfo" },
        {
            '$lookup': {
                'from': 'brokers',
                'localField': 'reviewInfo.reviewTo',
                'foreignField': '_id',
                'as': 'brokerInfo'
            }
        },
        { $unwind: "$brokerInfo" },
        {
            $project: {
                _id: '$reviewInfo._id',
                brokerId: '$_id',
                brokerName: '$brokerInfo.fullName',
                createdAt: '$reviewInfo.createdAt',
                review: '$reviewInfo.review',
                rating: '$reviewInfo.rating',
                profileImage: '$brokerInfo.profileImage',
                avgRating: '$avgReview',
                reviewcount: '$countReview',
            }
        },
        { $sort: { _id: -1 } },
        { $skip: page },
        { $limit: limit },
    ]);
}
//     return await reView.aggregate([
//         {
//             $match: {
//                 $and: [
//                     {
//                         reviewFor: new ObjectID(brokerId)
//                     }, {
//                         isActive: true
//                     }
//                 ]
//             }
//         },
//         {
//             $lookup: {
//                 from: "brokers",
//                 localField: "reviewTo",
//                 foreignField: "_id",
//                 as: "brokerInfo",
//             },
//         },
//         { $unwind: "$brokerInfo" },
//         { $sort: { _id: -1 } },
//         { $skip: page },
//         { $limit: limit },
//         // { $unwind: "$rating" },
//         // {
//         //     $addFields: {
//         //         averageRating: { $avg: "$rating" },
//         //     }
//         // },

//         // {
//         //     $group: {
//         //         _id: "$_id",
//         //         totalAmount: { $sum: "$rating" },
//         //         count: { $sum: 1 }
//         //         // count: { $sum: 1 },
//         //         // reviewId: { $first: "$_id" },
//         //         // brokerId: { $first: "$brokerInfo._id" },
//         //         // createdAt: { $first: "$createdAt" },
//         //         // fullName: { $first: "$brokerInfo.fullName" },
//         //         // rating: { $first: "$rating" },
//         //         // review: { $first: "$review" },
//         //         // isActive: { $first: "$isActive" },
//         //         // profileImage: { $first: "$brokerInfo.profileImage" },
//         //         // avgRating: { $first: { $avg: "$rating" } },
//         //         // labAvg: { $avg: "$labs" },
//         //     }
//         // },

//         // { $count:  "rating"  },

//         // {
//         //     $addFields: {
//         //         averageRatingCount: round({ $avg: "$rating" }, 1),
//         //     }
//         // },
//         // {
//         //     $addFields: {
//         //         averageRating: { $avg: "$rating" },
//         //     }
//         // },
//     ]);
// }

module.exports.brokerAllfollowers = async (brokerId, limit, page) => {
    var page = limit * page;
    return await follow.aggregate([
        {
            $match: {
                $and: [
                    {
                        followFor: new ObjectID(brokerId)
                    }
                ]
            }
        },
        {
            $lookup: {
                from: "brokers",
                localField: "followTo",
                foreignField: "_id",
                as: "brokerInfo",
            },
        },
        { $unwind: "$brokerInfo" },
        { $sort: { _id: -1 } },
        { $skip: page },
        { $limit: limit },
        // {
        //     $project: {
        //         _id: 1,
        //         isDelete: { $ifNull: ["$isDelete", ""] },
        //     }
        // }
    ]);
}

module.exports.verificationList = async (limit, page) => {
    var page = limit * page;

    return await broker.aggregate([
        {
            $match: { isProfileVerifyRequeste: true }
        },
        { $sort: { _id: -1 } },
        {
            $project: {
                _id: 1,
                fullName: { $ifNull: ["$fullName", ""] },
                officeCity: { $ifNull: ["$officeCity", ""] },
                selector: { $ifNull: ["$selector", ""] },
                mobile: { $ifNull: ["$mobile", ""] },
                createdAt: { $ifNull: ["$createdAt", ""] },
            }
        },
        { $skip: page },
        { $limit: limit },
    ]);
}

module.exports.verificationApprove = async (brokerData) => {
    return await brokerData.save();
}

module.exports.verificationReject = async (brokerData) => {
    return await brokerData.save();
}

module.exports.flagPropertyLists = async (limit, page) => {
    var page = limit * page;
    return await flag.aggregate([
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
                from: "properties",
                localField: "propertyId",
                foreignField: "_id",
                as: "propertyInfo",
            },
        },
        {
            '$unwind': {
                'path': "$propertyInfo",
                'preserveNullAndEmptyArrays': false
            }
        },
        {
            '$lookup': {
                'from': 'propertyprojects',
                'localField': 'propertyInfo.propertyProjectId',
                'foreignField': '_id',
                'as': 'projectDetails'
            }
        },
        {
            '$unwind': {
                'path': '$projectDetails',
                'preserveNullAndEmptyArrays': false
            }
        },

        { $sort: { _id: -1 } },
        {
            $project: {
                _id: 1,
                date: { $ifNull: ["$createdAt", ""] },
                property: '$projectDetails.projectName',
                officeCity: { $ifNull: ["$brokerInfo.officeCity", ""] },
                fullName: { $ifNull: ["$brokerInfo.fullName", ""] },
                propertyId: { $ifNull: ["$propertyInfo._id", ""] },

            }
        },
        { $skip: page },
        { $limit: limit },
    ]);
}

module.exports.flagRequestDelete = async (req) => {
    console.log(req.params.id);
    return await flag.findOneAndDelete(
        { _id: ObjectID(req.params.id) },
    );
}