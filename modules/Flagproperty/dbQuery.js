var ObjectID = require("mongoose").Types.ObjectId
const property = require("../Property/schema");
const broker = require("../Brokers/schema");
const flag = require("./schema");


/**
 * @author - atul singh chauhan
 * @getBrokerData - get Broker Data
 * @param {*} req
 * @returns 
 */
module.exports.getBrokerData = async (brokerId) => {

    return await broker.findOne({ _id: brokerId });
}


/**
* @author - atul singh chauhan
* @createFlagProperty - create Flag Property
* @param {*} req
* @returns 
*/
module.exports.createFlagProperty = async (newRequest) => {
    return await flag.create(newRequest);
}

/**
* @author - atul singh chauhan
* @findProperty - find Property
* @param {*} req
* @returns 
*/
module.exports.findProperty = async (brokerId, propertyId) => {

    return await property.findOne({ _id: propertyId, brokerId: brokerId });
}


