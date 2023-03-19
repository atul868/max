const { property } = require("../Property/schema");
const propertyBookMark = require("./schema");
const { ObjectId } = require('mongoose').Types;

/**
 * @author - atul singh chauhan
 * @propertyBookMark - property BookMark
 * @param {*} req
 * @returns 
 */
module.exports.addPropertyInBookMark = async (propertyId, brokerId, projectId) => {

  const propertyData = new propertyBookMark({
    propertyId: propertyId,
    brokerId: brokerId,
    projectId: projectId
  });
  return await propertyData.save();

}

/**
 * @author - atul singh chauhan
 * @checkBookMarkProperty - Check Book Mark Property
 * @param {*} req
 * @returns 
 */
module.exports.checkBookMarkProperty = async (propertyId, brokerId, field = 'propertyId') => {
  console.log('propertyId', propertyId, 'brokerId', brokerId);
  return await propertyBookMark.find({ [`${field}`]: propertyId, 'brokerId': brokerId }).lean();
}

/**
 * @author - atul singh chauhan
 * @wishListProperty -  Get  wish List Property of user
 * @param {*} req
 * @returns 
 */
module.exports.wishListProperty = async (userId) => {
  return await propertyBookMark.find({ 'brokerId': userId }).lean();
}

/**
 * @author - atul singh chauhan
 * @featchBookMarkProperty - Featch Book Mark Property
 * @param {*} perPage 
 * @param {*} page 
 * @returns 
 */
module.exports.featchBookMarkProperty = async (req, brokerId, limit, page) => {
  var page = limit * page;

  let res = await propertyBookMark.aggregate(
    [
      {
        $match: { brokerId: new ObjectId(brokerId) }
      },
      {
        $lookup: {
          from: "properties",
          localField: "propertyId",
          foreignField: "_id",
          as: "propertyInfo",
        },
      },
      {
        $addFields: {
          propertyData: {
            $map: {
              input: {
                $filter: {
                  input: "$propertyInfo",
                  as: "propertyRow",
                  cond: {
                    $eq: [
                      "$$propertyRow.isSold",
                      false,
                    ],
                  },
                },
              },
              as: "propertyData",
              in: {
                _id: "$$propertyData._id",
                brokerId: "$$propertyData.brokerId",
              },
            },
          },
        },
      },
      {
        $lookup: {
          from: "brokers",
          localField: "propertyData.brokerId",
          foreignField: "_id",
          as: "brokerInfo",
        },
      },
      {
        $lookup: {
          from: "follows",
          localField: "brokerInfo._id",
          foreignField: "followFor",
          as: "followersInfo",
        },
      },
      {
        $addFields: {
          followersCount: { $size: "$followersInfo" },
        }
      },
      { $unwind: "$propertyData" },
      { $unwind: "$propertyInfo" },
      {
        '$lookup': {
          'from': 'propertyprojects',
          'localField': 'projectId',
          'foreignField': '_id',
          'as': 'projectInfo'
        }
      },
      {
        '$unwind': {
          'path': '$projectInfo',
          'preserveNullAndEmptyArrays': true
        }
      },
      { $unwind: "$brokerInfo" },
      {
        $project: {
          id: 1,
          propertyId: { $ifNull: ["$propertyId", ""] },
          brokerId: { $ifNull: ["$brokerId", ""] },
          isActive: { $ifNull: ["$isActive", ""] },

          propertyInfo: { $ifNull: ["$propertyInfo", {}] },
          projectName: "$projectInfo.projectName",
          brokerInfo: { $ifNull: ["$brokerInfo", {}] },
          followersCount: { $ifNull: ["$followersCount", 0] },

        }
      },
      {
        '$sort': { '_id': -1 }
      },
      { '$skip': page },
      { '$limit': limit }
    ]
  );
  if (brokerId === req.user._id.toString()) { return res; }
  else if (req.user.isSuper == true) { return res }
  else if (req.user.group == 2) { return res }
  else if (req.user.isProfileVerify == false) {
    res.forEach((val, index) => {
      if (val.propertyInfo.propertyImage.length) {
        const imgData = val.propertyInfo.propertyImage.filter((ele) => ele.verifiedflag == false)
        console.log(res[index].propertyInfo.propertyImage);
        res[index].propertyInfo.propertyImage = imgData
      }
    })
  }
  return res;
}

module.exports.bookMarkRemove = async (id, brokerdId) => {

  return await propertyBookMark.deleteOne({ 'propertyId': ObjectId(id), 'brokerdId': brokerdId })

}
