var ObjectID = require("mongoose").Types.ObjectId
const constant = require("./schema");


/**
* @author - atul singh chauhan
* @findConstant - for geting all dropdown value
* @param {*} req
* @returns 
*/
module.exports.findConstant = async (data) => {
    return await constant.find({});
}


