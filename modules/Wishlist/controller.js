const message = require("../../config/message");
const response = require("../../utils/response");
const { ObjectId } = require('mongoose').Types;

const { checkBookMarkProperty, featchBookMarkProperty, addPropertyInBookMark,
    bookMarkRemove, wishListProperty } = require('./dbQuery');
const { propertyFind } = require('../Property/dbQuery');


/**
 * @author - atul singh chauhan
 * @propertyBookMark - property BookMark
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.create = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const res1 = await propertyFind(req.body.propertyId);
        console.log('ttt', res.propertyProjectId);
        const property = await checkBookMarkProperty(req.body.propertyId, brokerId);
        if (property.length) return res.json(response.success(204, message.serverResponseMessage.propertyExist));
        const data = await addPropertyInBookMark(req.body.propertyId, brokerId, res1.propertyProjectId);
        if (data) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_BOOKMARKED, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_BOOKMARK));
    } catch (error) {
        console.log(error);
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @showBookMarkProperty - Show Book Mark Property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.get = async function (req, res) {
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

        const brokerData = await featchBookMarkProperty(req, brokerId, limit, page);
        brokerData.forEach((element, index) => {
            brokerData[index].isBookMarked = true;
        });
        if (brokerData.length) return res.json(response.success(200, message.serverResponseMessage.BOOKMARK_PROPERTY_READ, brokerData));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_BOOKMARK_READ));
    } catch (error) {
        console.log();
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @propertyBookMarkRemove - Property Book Mark Remove
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.remove = async function (req, res) {
    try {
        const id = req.params._id;
        const bookmarkData = await bookMarkRemove(id, req.user._id);
        if (bookmarkData.deletedCount == 0) {
            return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
        }
        return res.json(response.success(200, message.serverResponseMessage.DATA_DELETE, bookmarkData));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}