var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");


const { createHelp, editHelp, getHelp, removeHelp } = require('./dbQuery');

/* create help center */
exports.create = async function (req, res) {
    try {

        if (!req.body.title && !req.body.description) {
            return res.json(response.success(200, message.serverResponseMessage.helpDataNeeded));
        }
        const data = await createHelp(req);
        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
};

/* edit help center */
exports.edit = async function (req, res) {
    try {


        const helpData = await editHelp(req);
        return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, helpData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get help center */
exports.get = async function (req, res) {
    try {
        const helpData = await getHelp(req, res);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, helpData));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* delete help center */
exports.remove = async function (req, res) {
    try {
        const helpData = await removeHelp(req);
        if (!helpData) {
            return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
        }
        return res.json(response.success(200, message.serverResponseMessage.DATA_DELETE));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}