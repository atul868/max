var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");
const help = require("./schema");


/**
 * @author - atul singh chauhan
 * @createHelp - create Help
 * @param {*} req
 * @returns 
 */
module.exports.createHelp = async (req) => {
    const create = new help({
        title: req.body.title,
        description: req.body.description,
    });
    return await create.save();
}


/**
* @author - atul singh chauhan
* @editHelp - Edit Help
* @param {*} req
* @returns 
*/
module.exports.editHelp = async (req) => {

    const helpData = await help.findOne({ _id: ObjectID(req.body.id) });
    if (!helpData) {
        return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
    }
    helpData.title = req.body.title ? req.body.title : helpData.title;
    helpData.description = req.body.description ? req.body.description : helpData.description;
    return await helpData.save();

}


/**
* @author - atul singh chauhan
* @getHelp -Get Help
* @param {*} req
* @returns 
*/
module.exports.getHelp = async (req) => {
    var helpData;
    if (req.body.id) {
        console.log(req.body.id)
         helpData = await help.findById({ _id: ObjectID(req.body.id) })
    } else {
         helpData = await help.aggregate([
            { $sort: { createdAt: 1 } },

        ])
        
    }
    return helpData;
}


/**
* @author - atul singh chauhan
* @removeHelp - Remove Help
* @param {*} req
* @returns 
*/
module.exports.removeHelp = async (req) => {
    return await help.findOneAndDelete(
        { _id: ObjectID(req.body.id) },
    );
}


