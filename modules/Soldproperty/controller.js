var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");


const { featchBrokerData, featchPropertyData, savePropertyData } = require('./dbQuery');


/**
 * @author - atul singh chauhan
 * @createSold - For Create Sold
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createSold = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await featchBrokerData(brokerId);
        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }
        const propertyData = await featchPropertyData(brokerId, req.body.propertyId);
        if (!propertyData) {
            return res.json(response.failure(204, message.serverResponseMessage.propertyNotExist));
        }

        if (propertyData.isSold == true) {
            propertyData.isSold = false;
        } else {
            propertyData.isSold = true;
        }
        const data = await savePropertyData(propertyData);
console.log('brokerData',brokerData,'propertyData',propertyData);
        return res.json(response.success(200, message.serverResponseMessage.soldSuccess, data));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
