var ObjectID = require("mongoose").Types.ObjectId
const broker = require("../Brokers/schema");
const callRequest = require("./schema");
const { property } = require("../Property/schema")

/**
 * @author - atul singh chauhan
 * @featchCallRequest - Featch Call Request
 * @param {*} req
 * @returns 
 */
module.exports.featchCallRequest = async (brokerId, propertyId, limit, page) => {
    var page = limit * page;

    return await callRequest.aggregate([
        {
            $match: { requestFor: ObjectID(brokerId), propertyId: ObjectID(propertyId) }
        },
        {
            $lookup: {
                from: "follows",
                localField: "requestBy",
                foreignField: "followFor",
                as: "requestedBrokerList",
            }
        },
        {
            $lookup: {
                from: "brokers",
                localField: "requestBy",
                foreignField: "_id",
                as: "brokerDetails",
            }
        },
        {
            $addFields: {
                followersCount: { $size: "$requestedBrokerList" },
            }
        },
        { $unwind: "$brokerDetails" },
        {
            $project: {
                _id: 1,
                propertyId: { $ifNull: ["$propertyId", ""] },
                requestBy: { $ifNull: ["$requestBy", ""] },
                requestFor: { $ifNull: ["$requestFor", ""] },
                // requestedBrokerList: { $ifNull: ["$requestedBrokerList", ""] },
                brokerDetails: { $ifNull: ["$brokerDetails", ""] },
                followersCount: { $ifNull: ["$followersCount", 0] },
            }
        },
        {
            '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
    ]);
}

/**
* @author - atul singh chauhan
* @sendCallRequest - Send Call Request
* @param {*} req
* @returns 
*/
module.exports.sendCallRequest = async (req, brokerId) => {

    const createRequest = new callRequest({
        propertyId: req.body.propertyId,
        requestFor: req.body.requestFor, /* request for another broker */
        requestBy: brokerId, /* request by logged in broker */
    });

    return await createRequest.save();

}


/**
* @author - atul singh chauhan
* @removecallRequest -Remove call Request
* @param {*} req
* @returns 
*/
module.exports.removecallRequest = async (brokerId, id) => {

    return await callRequest.findOneAndDelete(
        { _id: id },
    );

}


/**
* @author - atul singh chauhan
* @featchBrokerData - featch Broker Data
* @param {*} req
* @returns 
*/
module.exports.featchBrokerData = async (brokerId) => {
    return await broker.findOne({ _id: brokerId });
}

/**
* @author - atul singh chauhan
* @callReqData - call Req Data
* @param {*} req
* @returns 
*/
module.exports.callReqData = async (brokerId) => {
    return await callRequest.find({ requestBy: brokerId}).lean();;
}


module.exports.featchdealConnect = async (brokerId, limit, page) => {
    var page = limit * page;

    return await property.aggregate([
        {
            $match: { brokerId: ObjectID(brokerId) }
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
            '$lookup': {
                'from': 'propertyprojects',
                'localField': 'propertyProjectId',
                'foreignField': '_id',
                'as': 'projectDetails'
            }
        },
        {
            '$unwind': {
              'path': '$projectDetails',
              'preserveNullAndEmptyArrays': true
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
            '$match': {
                'callRequestCount': {
                    '$gt': 0
                }
            }
        },
        {
            $project: {
                _id: 1,
                projectName:'$projectDetails.projectName',
                propertyImage: { $ifNull: ["$propertyImage", ""] },
                callRequestCount: { $ifNull: ["$callRequestCount", ""] },
            }
        },
        {
            '$sort': { '_id': -1 }
        },
        { '$skip': page },
        { '$limit': limit }
    ]);
}