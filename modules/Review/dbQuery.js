var ObjectID = require("mongoose").Types.ObjectId
const reView = require("./schema");


/**
 * @author - atul singh chauhan
 * @createReview - Create Review
 * @param {*} req
 * @returns 
 */
module.exports.createReview = async (req, brokerId) => {
    const createReview = new reView({
        rating: req.body.rating,
        review: req.body.review,
        propertyId: req.body.propertyId,
        reviewFor: req.body.reviewFor, /* review to another broker id */
        reviewTo: brokerId, /* review by logged in broker */
    });

    return await createReview.save();
}


