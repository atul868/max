var ObjectID = require("mongoose").Types.ObjectId
const { property } = require("../Property/schema");
const broker = require("../Brokers/schema");
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
* @featchPropertyData - featch Property Data
* @param {*} req
* @returns 
*/
module.exports.featchPropertyData = async (brokerId, propertyId) => {
    return await property.findOne({ _id: propertyId, brokerId: brokerId });
}

/**
* @author - atul singh chauhan
* @savePropertyData - save Property Data
* @param {*} req
* @returns 
*/
module.exports.savePropertyData = async (propertyData) => {

    return await propertyData.save();
}


