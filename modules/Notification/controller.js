var ObjectID = require("mongoose").Types.ObjectId
const message = require("../../config/message");
const response = require("../../utils/response");
const notification = require("../../config/notification");
const pagination = require("../../config/index")["pagination"];
const { callRequestNotification, propertyNotification, followNotification, verifyNotification, notifications } = require('../Notification/schema');
const model = require("./schema");
const broker = require("../Brokers/schema");
const follow = require("../Followers/schema");


const { createNotification, editNotification, getNotification, inQuery, getAllToken, removeNotification } = require('./dbQuery');

/************** call request notification function **************/
exports.callreqNotification = async function (brokerId, requestFor, res) {

    const userData = await broker.findOne({ _id: brokerId });
    await notifications.create({ brokerId: requestFor, title: "Bromax", body: `${userData.fullName} sent a connect request for your property`, requestedBy: brokerId, type: "dealConnect" });
    const allToken = await broker.find({ _id: requestFor });
    allToken.forEach(async (token) => {
        if (token.token) {
            const message = {
                notification: {
                    title: "Bromax",
                    body: `${userData.fullName} sent a connect request for your property`,
                },
                token: token.token,
            };
            if (userData.profileImage) {
                message.android = {
                    notification: {
                        imageUrl: `${userData.profileImage}`,
                    },
                };
            }
            let msg = notification.sendNotification(message);
            console.log(msg, "msg");
        }
    })
}

/************** common notification function follow request **************/
exports.followreqNotification = async function (brokerId, followFor, res) {

    const userData = await broker.findOne({ _id: brokerId });
    const abc = await notifications.create(
        { brokerId: followFor, title: "Bromax", body: `${userData.fullName} Started following You`, requestedBy: brokerId, type: "follow" });
    const allToken = await broker.find({ _id: followFor });
    allToken.forEach(async (token) => {
        if (token.token) {
            const message = {
                notification: {
                    title: "Bromax",
                    body: `${userData.fullName} Started following You`,
                },
                token: token.token,
            };
            if (userData.profileImage) {
                message.android = {
                    notification: {
                        imageUrl: `${userData.profileImage}`,
                    },
                };
            }
            // const message = {
            //     token: "cf-GYNXsRXGhlwd8bw6l_0:APA91bFNMzb5LO8leJ9AmHyckM7S2Lov2SO8WbNuCyV01VDKdhMAQPjQFX5P2Adt26M8j-qX9yl7x8uuEeITcs0BUwEzroCgnmYb7f0TxvZIiNPH6mxpuYmu8TdAtVD6JpzFSOKdbuL8",
            //     notification: {
            //         title: "prakhar",
            //         body: "you have new follow request",
            //         imageUrl: "https://biotrips-docs.s3.amazonaws.com/download%20%281%29.jpg_1671171457623"
            //     }
            // }
            let msg = notification.sendNotification(message);
            console.log(msg, "msg");
        }
    })
}


/************** common notification function follow request **************/
exports.profileVerifyNotification = async function (brokerId, followFor, res) {

    const userData = await broker.findOne({ _id: brokerId });
    const abc = await notifications.create(
        { brokerId: followFor, title: "Bromax", body: "Congratulations Your profile verification request has been successfully approved", requestedBy: brokerId, type: "verify your self" });
    const allToken = await broker.find({ _id: followFor });
    allToken.forEach(async (token) => {
        if (token.token) {
            const message = {
                notification: {
                    title: "Bromax",
                    body: "Congratulations Your profile verification request has been successfully approved",
                },
                token: token.token,
            };
            // if (userData.profileImage) {
            //     message.android = {
            //         notification: {
            //             imageUrl: `${userData.profileImage}`,
            //         },
            //     };
            // }
            // const message = {
            //     token: "cf-GYNXsRXGhlwd8bw6l_0:APA91bFNMzb5LO8leJ9AmHyckM7S2Lov2SO8WbNuCyV01VDKdhMAQPjQFX5P2Adt26M8j-qX9yl7x8uuEeITcs0BUwEzroCgnmYb7f0TxvZIiNPH6mxpuYmu8TdAtVD6JpzFSOKdbuL8",
            //     notification: {
            //         title: "prakhar",
            //         body: "you have new follow request",
            //         imageUrl: "https://biotrips-docs.s3.amazonaws.com/download%20%281%29.jpg_1671171457623"
            //     }
            // }
            let msg = notification.sendNotification(message);
            console.log(msg, "msg");
        }
    })
}


/************** common get notification **************/
module.exports.get = async (req, res) => {
    try {
        let limit = 10;
        const pagee = Math.max(0, Number(req.query.page));
        var page = limit * pagee;
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }

        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }

        var data = await notifications.aggregate([
            {
                '$match': {
                    '$and': [
                        { brokerId: ObjectID(brokerId) },
                        { isDelete: false },
                    ]
                }
            },
            {
                $lookup: {
                    from: "brokers",
                    localField: "brokerId",
                    foreignField: "_id",
                    as: "authBrokerInfo",
                }
            },
            { '$unwind': { 'path': '$authBrokerInfo' } },
            {
                $lookup: {
                    from: "brokers",
                    localField: "requestedBy",
                    foreignField: "_id",
                    as: "otherBrokerInfo",
                }
            },
            { '$unwind': { 'path': '$otherBrokerInfo' } },
            {
                '$project': {
                    '_id': 1,
                    'loginBrokerId': '$authBrokerInfo._id',
                    'otherBrokerId': '$otherBrokerInfo._id',
                    'loginBrokerName': '$authBrokerInfo.fullName',
                    'otherBrokerName': '$otherBrokerInfo.fullName',
                    'loginBrokerImage': '$authBrokerInfo.profileImage',
                    'otherBrokerImage': '$otherBrokerInfo.profileImage',
                    'title': 1,
                    'body': 1,
                    'isDelete': 'isDelete',
                }
            },
            { '$sort': { '_id': -1 } },
            { '$skip': page },
            { '$limit': limit },
        ]);

        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, data));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/************** delete notification notification function **************/
exports.remove = async function (req, res) {
    try {
        await notifications.findOneAndUpdate({ _id: req.body.id }, { $set: { isDelete: true } });
        // await propertyNotification.findOneAndUpdate({ _id: req.body.id }, { $set: { isDelete: true } });
        return res.json(response.success(200, message.serverResponseMessage.DATA_DELETE));
    } catch (error) {
        console.log(error)
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}













/* common notification function for deal connect request */
// exports.callreqNotification = async function (brokerId, requestFor, res) {

//     const saveNotification = await callRequestNotification.create(
//         { brokerId: brokerId, title: "Bromax", body: "you have send request successfully" },
//         { brokerId: requestFor, title: "Bromax", body: "you have a new deal connect request" });

//     const allToken = await broker.find({ _id: { $in: [brokerId, requestFor] } });
//     // var sendMobileOtp = (member, otp) =>
//     allToken.forEach(async (token) => {
//         // var title = "req sent";
//         // var body = "req sent";
//         if (token.token) {
//             const message = {
//                 notification: {
//                     title: allToken.title,
//                     body: allToken.body,
//                 },
//                 token: token.token,
//             };
//             if (allToken.image) {
//                 message.android = {
//                     notification: {
//                         imageUrl: allToken.image,
//                     },
//                 };
//             }
//             let msg = notification.sendNotification(message);
//             console.log(msg, "msg");
//         }
//     })
// }


/* common notification function for property create */
exports.propertiesNotification = async function (brokerId, res) {

    const followersArray = await follow.find({ followFor: brokerId });
    followersArray.forEach(async (data) => {
        if (data) {
            await propertyNotification.create({ brokerId: data.followTo, title: "New property", body: "New property added please check" });

            const allToken = await broker.find({ _id: data.followTo });
            allToken.forEach(async (token) => {
                var title = "New property";
                var body = "New property added please check";

                if (token.token) {
                    const message = {
                        notification: {
                            title: allToken.title,
                            body: allToken.body,
                        },
                        token: token.token,
                    };
                    if (allToken.image) {
                        message.android = {
                            notification: {
                                imageUrl: allToken.image,
                            },
                        };
                    }
                    let msg = notification.sendNotification(message);
                    console.log(msg, "msg");
                }
            })
        }
    });
}


// /* common notification function for deal connect request */
// exports.profileVerifyNotification = async function (brokerId, res) {

//     const saveNotification = await verifyNotification.create(
//         { brokerId: brokerId, title: "Bromax", body: "you have send profileVerify request successfully" });

//     const allToken = await broker.find({ _id: { $in: [brokerId] } });
//     allToken.forEach(async (token) => {
//         if (token.token) {
//             const message = {
//                 notification: {
//                     title: allToken.title,
//                     body: allToken.body,
//                     fullName: allToken.fullName,
//                 },
//                 token: token.token,
//             };
//             if (allToken.profileImage) {
//                 message.android = {
//                     notification: {
//                         imageUrl: allToken.profileImage,
//                     },
//                 };
//             }
//             let msg = notification.sendNotification(message);
//             console.log(msg, "msg");
//         }
//     })
// }


// /* common notification function for deal connect request */
// exports.profileVerifiedNotification = async function (brokerId, res) {

//     const saveNotification = await verifyNotification.create(
//         { brokerId: brokerId, title: "Bromax", body: "profile verification done successfully" });

//     const allToken = await broker.find({ _id: { $in: [brokerId] } });
//     allToken.forEach(async (token) => {
//         if (token.token) {
//             const message = {
//                 notification: {
//                     title: allToken.title,
//                     body: allToken.body,
//                     fullName: allToken.fullName,
//                 },
//                 token: token.token,
//             };
//             if (allToken.profileImage) {
//                 message.android = {
//                     notification: {
//                         imageUrl: allToken.profileImage,
//                     },
//                 };
//             }
//             let msg = notification.sendNotification(message);
//             console.log(msg, "msg");
//         }
//     })
// }

/* == */
// var allToken =  broker.find({ _id: { $in: ["635b65376645e6f260c07b78", "635bb61918766d2d7b68ba08"] } });

// var sendMobileOtp = (member, otp) =>
//     allToken.forEach(async (token) => {

//         if (token.token) {
//             const message = {
//                 notification: {
//                     title: user.title,
//                     body: user.body,
//                 },
//                 token: token.token,
//             };
//             if (user.image) {
//                 message.android = {
//                     notification: {
//                         imageUrl: user.image,
//                     },
//                 };
//             }
//             let msg = notification.sendNotification(message);
//             console.log(msg);
//         }
//     });


/*========================= custom notification function ==========================*/
/* create notification */
exports.create = async function (req, res) {
    var userlist = await broker.find({ _id: { $in: ["635b65376645e6f260c07b78", "635bb61918766d2d7b68ba08"] } });
    console.log(userlist)

    try {
        let query = {};
        const requiredFields = ["title"];
        if (!checkKeys(req.body, requiredFields)) {
            return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
        }
        let user = await createNotification(req.body);

        if (user.users.length > 0) {
            user.users.forEach(async (user) => {
                let inquery = {};

                inquery._id = user;
                const token = await inQuery(inquery);

                const message = {
                    notification: {
                        title: user.title,
                        body: user.body,
                    },
                    token: token.token,
                };
                let msg = notification.sendNotification(message);
                console.log(msg);
            });

            return res.json(response.success(200, user.users, user));

        } else {
            const allToken = await getAllToken(query);

            allToken.forEach(async (token) => {

                if (token.token) {
                    const message = {
                        notification: {
                            title: user.title,
                            body: user.body,
                        },
                        token: token.token,
                    };
                    if (user.image) {
                        message.android = {
                            notification: {
                                imageUrl: user.image,
                            },
                        };
                    }
                    let msg = notification.sendNotification(message);
                    console.log(msg);
                }
            });
            return res.json(response.success(200, allToken, user));

        }
    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));

    }
};

/* create notification */
// exports.create = async function (req, res) {
//     try {
//         let query = {};
//         const requiredFields = ["title"];
//         if (!checkKeys(req.body, requiredFields)) {
//             return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
//         }
//         if (req.body.startDate) {
//             query.createdAt = {
//                 $gte: new Date(req.body.startDate),
//             };
//         }
//         if (req.query.endDate) {
//             query.createdAt = {
//                 $lte: new Date(req.query.endDate),
//             };
//         }
//         let user = await createNotification(req.body);

//         if (user.users.length > 0) {
//             user.users.forEach(async (user) => {
//                 let inquery = {};
//                 if (req.body.startDate) {
//                     inquery.createdAt = {
//                         $gte: new Date(req.body.startDate),
//                     };
//                 }
//                 if (req.query.endDate) {
//                     inquery.createdAt = {
//                         $lte: new Date(req.query.endDate),
//                     };
//                 }
//                 inquery._id = user;
//                 const token = await inQuery(inquery);

//                 const message = {
//                     notification: {
//                         title: user.title,
//                         body: user.body,
//                     },
//                     token: token.token,
//                 };
//                 let msg = notification.sendNotification(message);
//                 console.log(msg);
//             });

//             return res.json(response.success(200, user.users, user));

//         } else {
//             const allToken = await getAllToken(query);

//             allToken.forEach(async (token) => {

//                 if (token.token) {
//                     const message = {
//                         notification: {
//                             title: user.title,
//                             body: user.body,
//                         },
//                         token: token.token,
//                     };
//                     if (user.image) {
//                         message.android = {
//                             notification: {
//                                 imageUrl: user.image,
//                             },
//                         };
//                     }
//                     let msg = notification.sendNotification(message);
//                     console.log(msg);
//                 }
//             });
//             return res.json(response.success(200, allToken, user));

//         }
//     } catch (error) {
//         console.log(error);
//         return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));

//     }
// };

/* edit notification */
exports.edit = async function (req, res) {
    try {

        const data = await editNotification(req);

        return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get notification */
// exports.get = async function (req, res) {
//     try {
//         let skip = 0;
//         let page = parseInt(req.query.page) || 1;
//         let limit = parseInt(req.query.limit) || pagination.size;
//         skip = (page - 1) * limit;
//         delete req.query.page;
//         delete req.query.limit;
//         let sort = req.query.sort || { name: 1 };
//         delete req.query.sort;
//         let query = {};
//         let meta = {};
//         if (req.query.search) {
//             query.title = {
//                 $regex: new RegExp(
//                     req.query.search.toLowerCase().replace(/\s+/g, "\\s+"),
//                     "gi"
//                 ),
//             };
//             delete req.query.search;
//         }
//         const user = await getNotification(query, skip, limit, sort);
//         let count = await model.countDocuments(query);
//         meta.total = count;
//         meta.page = Math.ceil(count / limit);
//         return res.json(response.success(200, user, meta));
//     } catch (error) {
//         console.log(error, 'error')
//         return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));

//     }
// }

/* delete notification */
// exports.remove = async function (req, res) {
//     try {
//         const user = await removeNotification(req);
//         return res.json(response.success(200, message.serverResponseMessage.DATA_DELETE));
//     } catch (error) {
//         return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
//     }
// }
