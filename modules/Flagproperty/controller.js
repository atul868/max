const message = require('../../config/message');
const response = require('../../utils/response');


const { getBrokerData, createFlagProperty, findProperty } = require('./dbQuery');

/* create flag property */
exports.createFlag = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerID = req.body.brokerId;
        }
        else {
            var brokerID = req.user._id;
        }
        const brokerData = await getBrokerData(brokerID);

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }
        let brokerId = { brokerId: brokerID }
        let newRequest = { ...req.body, ...brokerId }
        const data = await createFlagProperty(newRequest);

        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}