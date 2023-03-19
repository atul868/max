const message = require("../../config/message");
const response = require("../../utils/response");
const { findConstant } = require('./dbQuery');

/**
 * @author - atul singh chauhan
 * @getConstant - getting constant and dropdown value
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
 exports.getConstant = async function (req, res) {
    try {
        const data = await findConstant(req);
        if (data)
            return res.json(response.success(200, message.serverResponseMessage.DROP_DOWN_DATA, data));
        else return res.json(response.success(204, message.serverResponseMessage.DROP_DOWN_DATA_ERROR));
    } catch (error) {
        return res.json(
            response.failure(404, message.serverResponseMessage.Catch_Error, error)
        );
    }
}