var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");
const auth = require("../../utils/auth");
const generateToken = auth.generateToken;
var round = require('mongo-round');
const axios = require("axios");
const { followreqNotification } = require("../Notification/controller");

const { createFollow, removeFollowData } = require('./dbQuery');
const { featchBrokerData } = require('../Callrequest/dbQuery');


/* add follow request */
exports.addFollow = async function (req, res) {
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

        const createFollower = await createFollow(req, brokerId);

        /*send notification start*/
        if (createFollower) {
            await followreqNotification(brokerId, req.body.followFor);
        }
        /*send notification end*/

        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, createFollower));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* delete follow request */
exports.deleteFollow = async function (req, res) {
    try {
        if (req.user.group == 1) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await featchBrokerData(brokerId);
        const unfollowBrokerId = req.body.unfollowBrokerId;

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        const followData = await removeFollowData(brokerId, unfollowBrokerId);

        if (!followData) {
            return res.json(response.failure(204, message.serverResponseMessage.deleteErrorFollow));
        }

        return res.json(response.success(200, message.serverResponseMessage.deleteSucessfully));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
