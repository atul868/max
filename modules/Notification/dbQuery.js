var ObjectID = require("mongoose").Types.ObjectId
const notification = require("./schema");
const message = require("../../config/message");
const response = require("../../utils/response");
const model = require("./schema");
const userDb = require("../Brokers/schema");
const { callRequestNotification, propertyNotification } = require('./schema');


/**
* @author - atul singh chauhan
* @createNotification - create Notification
* @param {*} req
* @returns 
*/
module.exports.createNotification = async (req) => {
    return await model.create(req);

}

/**
* @author - atul singh chauhan
* @editNotification - Edit Notification
* @param {*} req
* @returns 
*/
module.exports.editNotification = async (req) => {

    const NData = await model.findOne({ _id: ObjectID(req.body.id) });
    if (!NData) {
        return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
    }
    NData.title = req.body.title ? req.body.title : NData.title;
    NData.body = req.body.body ? req.body.body : NData.body;
    NData.topic = req.body.topic ? req.body.topic : NData.topic;
    NData.image = req.body.image ? req.body.image : NData.image;
    return await NData.save();
}

/**
* @author - atul singh chauhan
* @getNotification - Get Notification
* @param {*} req
* @returns 
*/
module.exports.getNotification = async (query, skip, limit, sort) => {
    return await model.find(query).skip(skip).limit(limit).sort(sort);

}

/**
* @author - atul singh chauhan
* @removeNotification - Remove Notification
* @param {*} req
* @returns 
*/
module.exports.removeNotification = async (req) => {
    return await model.findOneAndDelete(
        { _id: req.body.id },
    );
}

/**
* @author - atul singh chauhan
* @inQuery - inQuery
* @param {*} req
* @returns 
*/
module.exports.inQuery = async (inQuery) => {
    return await userDb.findOne(inQuery);
}

/**
* @author - atul singh chauhan
* @getAllToken - get All Token
* @param {*} req
* @returns 
*/
module.exports.getAllToken = async (query) => {
    return await userDb.find(query);
}
