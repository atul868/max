var ObjectID = require("mongoose").Types.ObjectId
const message = require('../../config/message');
const response = require('../../utils/response');
const auth = require("../../utils/auth");
const broker = require("./schema");
const generateToken = auth.generateToken;
const { handleAWSUpload } = require("../../config/s3");
var round = require('mongo-round');
const axios = require("axios");
const Model = require('../Brokers/schema');
const { profileVerifyNotification } = require('../Notification/controller');
const { getBrokerFollower } = require('../Followers/dbQuery');

const { createBroker, findBroker, verifyBrokerData, checkPhoneExist,
    addBrokerDetail, editPersonalProfileData, editProfessionalProfileData, verifyBrokerProfile,
    postedByBroker, featchBrokerProfile, createResendOpt, verificationReject,
    brokerAllReview, brokerAllfollowers, verificationList, verificationApprove,
    flagRequestDelete, flagPropertyLists, getBrokerCount,addContact,showContact } = require('./dbQuery');


var sendMobileOtp = (member, otp, forOtpAutofill) =>
    new Promise(async (resolve, reject) => {
        // if (config.get('isTesting') || !member.phone) return resolve();
        // let reqesut = `http://kyi.solutions/V2/http-api.php?apikey=E2NtwuyaiJK9d1hV&senderid=BIOTPS&number=${member.phone}&message=Welcome to the BioTrips family! Your OTP for logging into the BioTrips app is  ${otp}  
        //                                                                         ${forOtpAutofill}#var#}&format=json`;
         let reqesut=`http://kyi.solutions/V2/http-api.php?apikey=E2NtwuyaiJK9d1hV&senderid=BIOTPS&number=${member.phone}&message=Welcome to the BioTrips family Your OTP for logging into the app is ${otp} ${forOtpAutofill}#var#}&format=json`;                                                                       
        console.log("*** Sending Otp to ", member.phone);
        console.log("*** Sending Otp is ", otp);
        console.log(reqesut, 'reqesut')
        axios({
            method: "POST",
            // data: {},
            url: reqesut,
            headers: {
                "Content-Type": "application/json",
                Cookie: "PHPSESSID=k7sqrc14mlu1235h4821mfbvsj",
            },
        })
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
        return resolve();
    });

/* broker signup */
exports.signup = async function (req, res) {
    try {
        let checkMobile = req.body.mobile;
        let mobileValidation = checkMobile.toString().length;
        if (mobileValidation != 10) {
            return res.json(response.failure(204, message.serverResponseMessage.mobileNumber));
        }
        const phoneExist = await findBroker({ mobile: req.body.mobile });


        let otp = Math.floor(10000 + Math.random() * 90000);
        if (phoneExist) {
            phoneExist.otp = otp;

            sendMobileOtp(
                {
                    phone: req.body.mobile,
                },
                otp, req.body.forOtpAutofill,
                console.log("otp sent successfully")
            );
            await checkPhoneExist(phoneExist);

            return res.json(response.success(200, message.serverResponseMessage.otpsend, { otp: otp, forOtpAutofill: req.body.forOtpAutofill}));
        }
        // let otp = Math.floor(1000 + Math.random() * 9000);
        const createBrokerData = new broker({
            mobile: req.body.mobile,
            otp: otp,
            group: 1,
        });

        sendMobileOtp(
            {
                phone: req.body.mobile,
            },
            otp,
            console.log("otp sent successfully")
        );
        const data = await createBroker(createBrokerData);

        return res.json(response.success(200, message.serverResponseMessage.RegisterSuccess, { otp: otp,forOtpAutofill: req.body.forOtpAutofill}));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
};

/* broker verify otp */
exports.verifyOtp = async function (req, res) {
    try {

        const brokerData = await findBroker({ mobile: req.body.mobile });
        if (!brokerData) {
            console.log('mobile')
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        if (brokerData.otp !== req.body.otp) {
            console.log('otp')
            return res.json(response.failure(204, message.serverResponseMessage.IncorrectOtp));
        }
        const token = generateToken({ userId: brokerData._id });

        brokerData.otp = "";
        brokerData.authToken = token;

        const data = await verifyBrokerData(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.loginSuccess, { token, _id: data._id, mobile: data.mobile, isRegisterd: data.isRegisterd }));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker resend otp */
exports.resendOtp = async function (req, res) {
    try {
        let checkMobile = req.body.mobile;
        let mobileValidation = checkMobile.toString().length;
        if (mobileValidation != 10) {
            return res.json(response.failure(204, message.serverResponseMessage.mobileNumber));
        }

        const brokerData = await findBroker({ mobile: req.body.mobile });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        let otp = Math.floor(10000 + Math.random() * 90000);

        brokerData.otp = otp;

        sendMobileOtp(
            {
                phone: req.body.mobile,
            },
            otp, req.body.forOtpAutofill,
            console.log("otp sent successfully")
        );
        await createResendOpt(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.otpResend, { otp: otp, forOtpAutofill: req.body.forOtpAutofill }));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker property details */
exports.brokerDetail = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await findBroker({ _id: brokerId });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.selector = req.body.selector;
        brokerData.fullName = req.body.fullName;
        brokerData.dealIn = req.body.dealIn;
        brokerData.intrestState = req.body.intrestState;
        brokerData.interestCity = req.body.interestCity;
        brokerData.dealLocality = req.body.dealLocality;
        brokerData.specializationSubType = req.body.specializationSubType;
        brokerData.subCategory = req.body.subCategory;
        brokerData.developerId = req.body.developerId;
        brokerData.projectId = req.body.projectId;
        brokerData.language = req.body.language;
        // brokerData.projectExperties = req.body.projectExperties;
        brokerData.isRegisterd = false;
        const data = await addBrokerDetail(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker personal profile edit/update */
exports.editProfile = async function (req, res) {
    try {
        var brokerId;
        // console.log(req.files.profileImage,'llll')
        if (req.user.group == 2) {
            brokerId = req.body.brokerId;
        }
        else {
            brokerId = req.user._id;
        }
        console.log(brokerId);
        const brokerData = await findBroker({ _id: brokerId });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        // let upload_location = {};
        // for (let file_name in req.files) {
        //     upload_location[file_name] = await handleAWSUpload(
        //         req.files[file_name][0]
        //     );
        // }
        // if (upload_location["profileImage"]) {
        //     brokerData.image = { image: upload_location["profileImage"]};
        // }

        brokerData.fullName = req.body.fullName ? req.body.fullName : brokerData.fullName;
        brokerData.officeCity = req.body.officeCity ? req.body.officeCity : brokerData.officeCity;
        brokerData.officeState = req.body.officeState ? req.body.officeState : brokerData.officeState;
        brokerData.dob = req.body.dob ? req.body.dob : brokerData.dob;
        brokerData.email = req.body.email ? req.body.email : brokerData.email;
        brokerData.profileImage = req.body.profileImage ? req.body.profileImage : brokerData.profileImage;
        brokerData.selector = req.body.selector ? req.body.selector : brokerData.selector;
        brokerData.companyName = req.body.companyName ? req.body.companyName : brokerData.companyName;
        brokerData.dealIn = req.body.dealIn ? req.body.dealIn : brokerData.dealIn;
        brokerData.specializationSubType = req.body.specializationSubType ? req.body.specializationSubType : brokerData.specializationSubType;
        brokerData.expertise = req.body.expertise ? req.body.expertise : brokerData.expertise;
        brokerData.intrestState = req.body.intrestState ? req.body.intrestState : brokerData.intrestState;
        brokerData.interestCity = req.body.interestCity ? req.body.interestCity : brokerData.interestCity;
        brokerData.dealLocality = req.body.dealLocality ? req.body.dealLocality : brokerData.dealLocality;
        brokerData.subCategory = req.body.subCategory ? req.body.subCategory : brokerData.subCategory;
        brokerData.projectExperties = req.body.projectExperties ? req.body.projectExperties : brokerData.projectExperties;
        brokerData.developerId = req.body.developerId ? req.body.developerId : brokerData.developerId;
        brokerData.projectId = req.body.projectId ? req.body.projectId : brokerData.projectId;
        brokerData.language = req.body.language ? req.body.language : brokerData.language;
        brokerData.gstNo = req.body.gstNo ? req.body.gstNo : brokerData.gstNo;
        brokerData.reraNo = req.body.reraNo ? req.body.reraNo : brokerData.reraNo;
        brokerData.uploadBusinessCard = req.body.BusinessCard ? req.body.BusinessCard : brokerData.uploadBusinessCard;
        const data = await editPersonalProfileData(brokerData);
        return res.json(response.success(200, message.serverResponseMessage.updateSucessfully, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker professional profile edit/update */
exports.editProfessionalProfile = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await findBroker({ _id: brokerId });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.companyName = req.body.companyName ? req.body.companyName : brokerData.companyName;
        brokerData.dealIn = req.body.dealIn ? req.body.dealIn : brokerData.dealIn;
        brokerData.specializationSubType = req.body.specializationSubType ? req.body.specializationSubType : brokerData.specializationSubType;
        brokerData.expertise = req.body.expertise ? req.body.expertise : brokerData.expertise;
        brokerData.intrestState = req.body.intrestState ? req.body.intrestState : brokerData.intrestState;
        brokerData.interestCity = req.body.interestCity ? req.body.interestCity : brokerData.interestCity;
        brokerData.dealLocality = req.body.dealLocality ? req.body.dealLocality : brokerData.dealLocality;
        brokerData.subCategory = req.body.subCategory ? req.body.subCategory : brokerData.subCategory;
        brokerData.projectExperties = req.body.projectExperties ? req.body.projectExperties : brokerData.projectExperties;
        const data = await editProfessionalProfileData(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.updateSucessfully, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker profile verify */
exports.verifyProfile = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await findBroker({ _id: brokerId });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.dealIn = req.body.dealIn ? req.body.dealIn : brokerData.dealIn;
        brokerData.specializationSubType = req.body.specializationSubType ? req.body.specializationSubType : brokerData.specializationSubType;
        brokerData.selector = req.body.selector ? req.body.selector : brokerData.selector;
        brokerData.intrestState = req.body.intrestState ? req.body.intrestState : brokerData.intrestState;
        brokerData.interestCity = req.body.interestCity ? req.body.interestCity : brokerData.interestCity;
        brokerData.dealLocality = req.body.dealLocality ? req.body.dealLocality : brokerData.dealLocality;
        brokerData.fullName = req.body.fullName ? req.body.fullName : brokerData.fullName;
        brokerData.email = req.body.email ? req.body.email : brokerData.email;
        brokerData.companyName = req.body.companyName ? req.body.companyName : brokerData.companyName;
        brokerData.gstNo = req.body.gstNo ? req.body.gstNo : brokerData.gstNo;
        brokerData.reraNo = req.body.reraNo ? req.body.reraNo : brokerData.reraNo;
        brokerData.officeCity = req.body.officeCity ? req.body.officeCity : brokerData.officeCity;
        brokerData.officeState = req.body.officeState ? req.body.officeState : brokerData.officeState;
        brokerData.officeLocality = req.body.officeLocality ? req.body.officeLocality : brokerData.officeLocality;
        // brokerData.officeBuilding = req.body.officeBuilding ? req.body.officeBuilding : brokerData.officeBuilding;
        brokerData.isProfileVerifyRequeste = true;
        brokerData.profileImage = req.body.profileImage ? req.body.profileImage : brokerData.profileImage;
        brokerData.uploadBusinessCard = req.body.uploadBusinessCard ? req.body.uploadBusinessCard : brokerData.uploadBusinessCard;

        const data = await verifyBrokerProfile(brokerData);
        return res.json(response.success(200, message.serverResponseMessage.verifyVerificationRequest, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* broker profile verify */
exports.verifyExpertiseProfile = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        else {
            var brokerId = req.user._id;
        }
        const brokerData = await findBroker({ _id: brokerId });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.fullName = req.body.fullName ? req.body.fullName : brokerData.fullName;
        brokerData.email = req.body.email ? req.body.email : brokerData.email;
        brokerData.companyName = req.body.companyName ? req.body.companyName : brokerData.companyName;
        brokerData.gstNo = req.body.gstNo ? req.body.gstNo : brokerData.gstNo;
        brokerData.reraNo = req.body.reraNo ? req.body.reraNo : brokerData.reraNo;
        brokerData.officeCity = req.body.officeCity ? req.body.officeCity : brokerData.officeCity;
        brokerData.officeState = req.body.officeState ? req.body.officeState : brokerData.officeState;
        brokerData.officeLocality = req.body.officeLocality ? req.body.officeLocality : brokerData.officeLocality;
        // brokerData.officeBuilding = req.body.officeBuilding ? req.body.officeBuilding : brokerData.officeBuilding;
        brokerData.isProfileVerifyRequeste = true;
        brokerData.profileImage = req.body.profileImage ? req.body.profileImage : brokerData.profileImage;
        brokerData.uploadBusinessCard = req.body.uploadBusinessCard ? req.body.uploadBusinessCard : brokerData.uploadBusinessCard;

        const data = await verifyBrokerProfile(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.verifySuccessfully, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* posted by you/broker */
exports.postedByYou = async function (req, res) {
    console.log(req.query);
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1 && req.query.brokerId) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1) {
            var brokerId = req.user._id;
        }
        const brokerData = await postedByBroker(req,brokerId, limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get broker profile */
// exports.getProfile = async function (req, res) {
//     try {
//         if (req.user.group == 2) {
//             var brokerId = req.body.brokerId;
//         }
//         else {
//             var brokerId = req.user._id;
//         }
//         const brokerData = await featchProfile(brokerId);
//         return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));

//     } catch (error) {
//         console.log(error, 'error')
//         return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
//     }
// }

/*------------ get broker profile details and review --------------*/
exports.getBrokerProfile = async function (req, res) { //incomplete
    try {
        const weights = {
            fullName: 5,
            officeCity: 5,
            officeState: 5,
            dob: 5,
            email: 5,
            profileImage: 5,
            selector: 5,
            companyName: 5,
            dealIn: 10,
            specializationSubType: 10,
            intrestState: 5,
            interestCity: 5,
            dealLocality: 10,
            subCategory: 5,
            developerId: 5,//for projectExperties
            projectId: 5,//for projectExperties
            mobile: 5,
        };
        // const brokerId = req.user.userId.userId ? req.user.userId.userId : req.body.brokerId;
        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1 && req.query.brokerId) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1) {
            var brokerId = req.user._id;
        }
        const brokerData = await featchBrokerProfile(brokerId, req);
        let data = Object.entries(weights)
            .reduce((a, [key, weight]) => a + (brokerData[0][key] ? weight : 0), 0);
        brokerData.push({ profilePercentage: data });
        const followData = await getBrokerFollower(req.user._id)
        console.log('brokerData', brokerData, 'followData', followData);
        brokerData.forEach((element, index) => {
            const followerData = followData.find(ele => {
                console.log(ele.followFor, 'ele.followFor', element._id, 'element._id');
                return ele.followFor.equals(element._id)
            })
            console.log(followerData);


            followerData ? brokerData[index].isFollowed = true : brokerData[index].isFollowed = false
        });
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/*------------ get broker profile details and review --------------*/
exports.getBrokerAllCount = async function (req, res) { //incomplete
    try {
        // const brokerId = req.user.userId.userId ? req.user.userId.userId : req.body.brokerId;
        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1 && req.query.brokerId) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1) {
            var brokerId = req.user._id;
        }
        const brokerData = await getBrokerCount(brokerId, req);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get broker all review list */
exports.getBrokerAllReview = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }

        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else if(req.query.brokerId) {
            var brokerId = req.query.brokerId;
        }
        const data = await brokerAllReview(brokerId, limit, page);
        let searchResult = data.length;
        // (data.length)return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.DATA_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.DATA_READ_ERROR));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* get broker all followers list */
exports.getBrokerAllfollowers = async function (req, res) {
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
        const brokerData = await brokerAllfollowers(brokerId, limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* posted by you/broker */
exports.profileVerificationList = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await verificationList(limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* posted by you/broker */
exports.profileVerificationApprove = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        const brokerData = await findBroker({ _id: new ObjectID(brokerId) });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.isProfileVerify = true;
        brokerData.isProfileVerifyRequeste = false;
        const data = await verificationApprove(brokerData);
        /*send notification start*/
        if (data) {
            await profileVerifyNotification(req.user._id, brokerId);
        }
        /*send notification end*/
        return res.json(response.success(200, message.serverResponseMessage.PROFILE_VERIFICATION_SUCCESS, data));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* posted by you/broker */
exports.profileVerificationReject = async function (req, res) {
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        const brokerData = await findBroker({ _id: new ObjectID(brokerId) });

        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }

        brokerData.isProfileVerifyRequeste = false;
        const data = await verificationReject(brokerData);

        return res.json(response.success(200, message.serverResponseMessage.PROFILE_VERIFICATION_REJECT_SUCCESS, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/* posted by you/broker */
exports.flagPropertyList = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await flagPropertyLists(limit, page);
        return res.json(response.success(200, message.serverResponseMessage.DATA_READ, data));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.flagPropertyRequestDelete = async function (req, res) {
    try {
        let deletedFlag = await flagRequestDelete(req);
        if (deletedFlag)
            return res.json(response.success(200, message.serverResponseMessage.DATA_DELETE));
    } catch (error) {
        console.log('catch');
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 *@author - atul singh chauhan
 * @brokerLogout - broker Logout
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.brokerLogout = async function (req, res) {
    try {
        const id = req.user._id;
        const userData = await Model.findOne({ _id: id });
        if (!userData)
            return res.json(response.success(204, message.serverResponseMessage.ADMIN_DOES_NOT_EXISTS));
        if (userData.authToken !== null) {
            const a = await Model.findByIdAndUpdate(id, { authToken: null });
            return res.json(response.success(200, { "message": "Logout Succesfully" }));
        }
        else
            return res.json(response.success(204, { "message": "first you need to login" }));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


exports.createContact = async function (req, res) {
    try {
        let brokerId = { brokerId: req.user._id }
        let newReq = { ...req.body,...brokerId }
        const Response = await addContact(newReq);
        if (Response) return res.json(response.success(200, message.serverResponseMessage.CONTACT_CREATED, Response));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_CONTACT_CREATE, err));
    } catch (error) {
        console.log(error)
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

exports.getContact = async function (req, res) {
    try {
        const data = await showContact({ brokerId:req.user._id });
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.CONTACT_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_CONTACT_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}