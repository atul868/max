var ObjectID = require("mongoose").Types.ObjectId
const follow = require("./schema");

  /**
 * @author - atul singh chauhan
 * @createFollow - create Follow
 * @param {*} req
 * @returns 
 */
   module.exports.createFollow = async (req, brokerId) => {
    const createFollow = new follow({
        propertyId: req.body.propertyId,
        followFor: req.body.followFor, /* follow request to another broker id */
        followTo: brokerId, /* follow by logged in broker */
    });

    return await createFollow.save();
  
  }
  

  /**
 * @author - atul singh chauhan
 * @removeFollowData - remove Follow Data
 * @param {*} req
 * @returns 
 */
module.exports.removeFollowData = async (brokerId,unfollowBrokerId) => {
    return await follow.findOneAndDelete(
        { followTo: brokerId, followFor: unfollowBrokerId },
    );
    }
  
    /**
 * @author - atul singh chauhan
 * @getBrokerFollower -  Get Broker Follower
 * @param {*} req
 * @returns 
 */
 module.exports.getBrokerFollower = async (userId) => {
  return await follow.find({'followTo':userId}).lean();
}