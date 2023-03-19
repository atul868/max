const message = require('../../config/message');
const response = require('../../utils/response');
const auth = require("../../utils/auth");
const generateToken = auth.generateToken;
const { handleAWSUpload } = require("../../config/s3");
const notification = require("../../config/notification");
const { callreqNotification } = require("../Notification/controller");

const broker = require("../Brokers/schema");
const { callRequestNotification } = require('../Notification/schema');

var round = require('mongo-round');
const axios = require("axios");

const { featchCallRequest, sendCallRequest, removecallRequest, featchBrokerData, featchdealConnect } = require('./dbQuery');

/* get call request */
exports.getCallRequest = async function (req, res) { //incomplete
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const callData = await featchCallRequest(brokerId, req.query.propertyId, limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, callData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get deal connect */
exports.dealConnect = async function (req, res) { //incomplete
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }

        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const callData = await featchdealConnect(brokerId, limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, callData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* send call request */
exports.callRequest = async function (req, res) {
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

        const createRequest = await sendCallRequest(req, brokerId);
        /*send notification start*/
        if (createRequest) {
            await callreqNotification(brokerId, req.body.requestFor);
        }
        /*send notification end*/

        // if (createRequest) {
        //     const saveNotification = await callRequestNotification.create(
        //         { brokerId: brokerId, title: "request sent successfully" },
        //         { brokerId: req.body.requestFor, title: "you have a new deal connect request" });

        //     const allToken = await broker.find({ _id: { $in: [brokerId, req.body.requestFor] } });
        //     // var sendMobileOtp = (member, otp) =>
        //     allToken.forEach(async (token) => {

        //         if (token.token) {
        //             const message = {
        //                 notification: {
        //                     title: "allToken.title",
        //                     body: "allToken.body",
        //                 },
        //                 token: token.token,
        //             };
        //             if (allToken.image) {
        //                 message.android = {
        //                     notification: {
        //                         imageUrl: allToken.image,
        //                     },
        //                 };
        //             }
        //             let msg = notification.sendNotification(message);
        //             console.log(msg, "msg");
        //         }
        //     });
        // }
        ///////////////////////////////////////////////////////////
        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, createRequest));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* delete call request */
exports.deletecallRequest = async function (req, res) {
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

        const callRequestData = await removecallRequest(brokerId, req.body.id);

        if (!callRequestData) {
            return res.json(response.failure(204, message.serverResponseMessage.deleteErrorFollow));
        }

        return res.json(response.success(200, message.serverResponseMessage.deleteSucessfully));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
