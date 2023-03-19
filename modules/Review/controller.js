var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");
var round = require('mongo-round');
const { createReview } = require('./dbQuery');
const { featchBrokerData } = require('../Callrequest/dbQuery');

/**
 * @author - atul singh chauhan
 * @addReview - For Add Review
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addReview = async function (req, res) {
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
        if (req.body.rating > 5 || req.body.rating < 1) {
            return res.json(response.failure(204, message.serverResponseMessage.ratingError));
        }
        const data = await createReview(req, brokerId);
        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}