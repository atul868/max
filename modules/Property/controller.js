const message = require("../../config/message");
const response = require("../../utils/response");
const { property } = require("./schema");
const { ObjectId } = require('mongoose').Types;
const { plotAreaInitialisation, constructedAreaInitialisation } = require('../../utils/helperFunction');

const follow = require("../Followers/schema");
const { callRequestNotification, propertyNotification } = require('../Notification/schema');
const { propertiesNotification } = require("../Notification/controller");

const { propertyCreate, fetchAllPrimeListingProperty, showNewProperty, createPropertyAsHotDeal, fetecHotDealProperty, fetchApartment,
    addPropertyInPrimeListing, fetecTopBroker, addNewsFeedReport, featchPropertyReport, updateProperty, removeProperty, featchNewsFeed,
    featchBrokerProperty, removeReviewProperty, removeCallRequestProperty, removeBookMarkProperty, removeReportProperty, ShowTopBroker,
    filterBrokerData, filterPropertyData, featchPropertyDetail, fetecBroker, fetecbroker, propertyFind, removeFlag, fetchPropertyLocation,
    fetchDeveloperAndPropertyFilter, deletePropertyFromHotDeal, updatePropertyImageFlag } = require('./dbQuery');
const { wishListProperty } = require('../Wishlist/dbQuery')//callReqData
const { callReqData } = require('../Callrequest/dbQuery')
const { createProject, createDeveloper, findDeveloper, findProject } = require('../Admin/dbQuery')

exports.createProperty = async function (req, res) {
    try {
        let plotArea = plotAreaInitialisation(req.body.plotAreaUnit, req.body.plotAreaVal);
        let constructedArea = constructedAreaInitialisation(req.body.constructedAreaUnit, req.body.constructedAreaVal);
        let brokerId = { brokerId: req.user._id }
        let project;
        if (req.body.projectName) {
            if (req.body.propertyDeveloperId) {
                project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, developerId: req.body.propertyDeveloperId, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
            } else { project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } } }
        }
        let developer = { developeName: req.body.developerName, developeHeadquaterLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
        let newReq = { ...req.body, ...plotArea, ...constructedArea, ...brokerId }
        let propertyProjectId;
        let propertyDeveloperId;
        if (req.body.developerName) {
            console.log("req.body.developerName",req.body.developerName);
            const isDeveloper = await findDeveloper({developeName: req.body.developerName});
            console.log('isDeveloper',isDeveloper);
            if (!isDeveloper) {
                console.log('isDeveloper in side if',isDeveloper);
                const data = await createDeveloper(developer);
                propertyDeveloperId = { propertyDeveloperId: data._id }
                project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, developerId: data._id, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
            }
            else {
                project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, developerId: isDeveloper._id, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
                propertyDeveloperId = { propertyDeveloperId: isDeveloper._id }
            }
        }
        if (req.body.developerName) {
            newReq = { ...req.body, ...plotArea, ...constructedArea, ...brokerId, ...propertyDeveloperId }
            //newReq = { ...newReq, ...propertyDeveloperId }
        }
        if (req.body.projectName) {

            const isProject = await findProject({ projectName: req.body.projectName });
            if (!isProject) {
                const data = await createProject(project);
                propertyProjectId = { propertyProjectId: data._id }
            }
            else {
                propertyProjectId = { propertyProjectId: isProject._id }
            }
        }
        if (req.body.projectName) {
            newReq = { ...newReq, ...propertyProjectId }
            // newReq = { ...req.body, ...plotArea, ...constructedArea, ...brokerId, ...propertyProjectId,...propertyDeveloperId }
        }
        const Response = await propertyCreate(newReq);
        if (Response) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_CREATED, Response));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_CREATE, err));
    } catch (error) {
        console.log(error)
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

exports.showAllProperty = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data1 = await showNewProperty(req, limit, page);
        if (req.user.group == 1) {
            let data = [...data1[0]];
            const wishListData = await wishListProperty(req.user._id)
            data.forEach((element, index) => {
                const wishData = wishListData.find(ele => {
                    return ele.propertyId.equals(element._id)
                })
                wishData ? data[index].isBookMarked = true : data[index].isBookMarked = false
            });
            if (data.length) return res.json(response.Success(200, data1[1], message.serverResponseMessage.PROPERTY_READ, data));
            else return res.json(response.Success(204, data1[1], message.serverResponseMessage.FAILURE_PROPERTY_READ, data));
        }
        else if (req.user.group == 2) {
            if (data1.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data1));
            else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
        }
    } catch (error) {
        console.log(error);
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @addPropertyAsHotDeal - add property in hot deal 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.addPropertyAsHotDeal = async function (req, res) {
    try {
        const propertyData = await property.findOne({ _id: new ObjectId(req.body._id) });
        if (propertyData.propertyAsHotDeal == false && propertyData.propertyAsPrimeListing == false) {
            const Response = await createPropertyAsHotDeal(req.body._id);
            if (Response) return res.json(response.success(200, message.serverResponseMessage.HOTDEAL_PROPERTY_CREATED, Response));
            else return res.json(response.success(204, message.serverResponseMessage.FAILURE_HOTDEAL_PROPERTY_CREATE, err));
        }
        else {
            return res.json(response.success(204, message.serverResponseMessage.HOTDEAL_OR_PRIME));
        }
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @removePropertyFromHotDeal - Remove Property From HotDeal
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.removePropertyFromHotDeal = async function (req, res) {
    try {
        const propertyData = await property.findOne({ _id: new ObjectId(req.body._id) });
        if (propertyData.propertyAsHotDeal) {
            const Response = await deletePropertyFromHotDeal(req.body._id);
            if (Response) return res.json(response.success(200, message.serverResponseMessage.HOTDEAL_PROPERTY_DELETED, Response));
            else return res.json(response.success(204, message.serverResponseMessage.HOTDEAL_PROPERTY_W));
        }
        else {
            return res.json(response.success(204, message.serverResponseMessage.HOTDEAL));
        }
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};
/**
 * @author - atul singh chauhan
 * @showHotDealProperty - show hot deal property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showHotDealProperty = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await fetecHotDealProperty(limit, page);
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.HOTDEAL_PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_HOTDEAL_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @searchApartment - search apartment 
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.searchApartment = async function (req, res) {
    try {

        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const Response = await fetchApartment(req, limit, page);
        let searchResult = Response.length;
        if (Response) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, [Response, { "searchResult": searchResult }]));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @searchPropertyLocation - Search Property Location
 * @param {*} res 
 * @returns 
 */
exports.searchPropertyLocation = async function (req, res) {
    try {
        const Response = await fetchPropertyLocation(req);
        if (Response.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, Response));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @showAllPropertyDetail - showAllPropertyDetail
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showAllPropertyDetail = async function (req, res) {
    try {
        const Response = await featchPropertyDetail(req.body.propertyId);
        if (Response) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, Response));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};



/**
 * @author - atul singh chauhan
 * @addPropertyAsPrimeListing - add Property in PrimeListing
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.addPropertyAsPrimeListing = async function (req, res) {
    try {
        const propertyData = await property.findOne({ _id: new ObjectId(req.body._id) });
        if (propertyData.propertyAsHotDeal == false && propertyData.propertyAsPrimeListing == false) {
            const Response = await addPropertyInPrimeListing(req.body._id);
            if (Response) return res.json(response.success(200, message.serverResponseMessage.PRIME_PROPERTY_CREATED, Response));
            else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PRIME_PROPERTY_CREATE, err));
        }
        else {
            return res.json(response.success(204, message.serverResponseMessage.HOTDEAL_OR_PRIME));
        }
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @showAllPrimeListingProperty - show All PrimeListing Property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showAllPrimeListingProperty = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await fetchAllPrimeListingProperty(limit, page);
        let primePropertyCount = data.length;
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PRIME_PROPERTY_READ, [data, { 'primePropertyCount': primePropertyCount }]));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PRIME_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @showHotDealProperty - show hot deal property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.searchTopBroker = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await fetecTopBroker(req, limit, page);
        let searchResult = data.length;
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @searchBroker - show hot deal property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.searchBroker = async function (req, res) {
    try {
        let limit = 10;
        var page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await fetecbroker(req, limit, page);
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};



/**
 * @author - atul singh chauhan
 * @showHotDealProperty - show hot deal property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showBroker = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await fetecBroker(req, page, limit);
        let searchResult = data.length;
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, [data, { "searchResult": searchResult }]));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
}


/**
 * @author - atul singh chauhan
 * @showHotDealProperty - show hot deal property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showTopBroker = async function (req, res) {
    try {
        let limit = 10;
        var data;
        const page = Math.max(0, req.query.page);
        if (req.query.limit) {
            limit = req.query.limit;
        }
        if (req.query.topBroker) { data = await ShowTopBroker(req, limit, page); }
        else if (req.query.isSearch) { data = await fetecTopBroker(req, limit, page); }
        else if (req.query.isFilter) { data = await filterBrokerData(req, limit, page); }
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
    } catch (error) {
        console.log(error);
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @newsFeedReport - News Feed Report
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.newsFeedReport = async function (req, res) {
    try {

        const data = await addNewsFeedReport(req);
        if (data) return res.json(response.success(200, message.serverResponseMessage.NEWS_FEED_REPORT_CREATED, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_BOOKMARK));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @showNewsFeedReport - show News Feed Report
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showNewsFeedReport = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await featchPropertyReport(limit, page);
        if (data) return res.json(response.success(200, message.serverResponseMessage.NEWS_FEED_REPORT_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_NEWS_FEED_REPORT_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * 
 * @author - atul singh chauhan
 * @deleteProperty - delete property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deleteProperty = async function (req, res) {
    try {
        var id = req.params._id;
        const propertyDetails = await propertyFind(id);
        if (propertyDetails.isActive) {
            const deletedProperty = await removeProperty(id);
            if (deletedProperty) {
                const review = await removeReviewProperty(id);
                const removeCall = await removeCallRequestProperty(id);
                const removeBook = await removeBookMarkProperty(id);
                const removeReport = await removeReportProperty(id);
                const removeFla = await removeFlag(id);
                console.log('review==>>>', review);
                console.log('removeCall==>>>', removeCall);
                console.log('removeBook==>>>', removeBook);
                console.log('removeReport==>>>', removeReport);
                console.log('removeReport==>>>', removeFla);
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DELETE, deletedProperty));
            }
        } else return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DOES_NOT_EXISTS, []));
    } catch (error) {
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * 
 *  @author - atul singh chauhan
 * @editProperty - edit property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.editProperty = async function (req, res) {
    try {
        const propertyData = await property.findOne({ _id: new ObjectId(req.body._id) });
        let project;
        if (req.body.projectName) {
            if (req.body.propertyDeveloperId)
                project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, developerId: req.body.propertyDeveloperId, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
            else project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
        }
        let developer = { developeName: req.body.developerName, developeHeadquaterLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
        let propertyProjectId;
        let propertyDeveloperId;
        if (req.body.developerName) {
            const isDeveloper = await findDeveloper({developeName: req.body.developerName});
            if (!isDeveloper) {
                const data = await createDeveloper(developer);
                propertyDeveloperId = { propertyDeveloperId: data._id }
                project = { projectName: req.body.projectName, projectType: req.body.chooseCategory, developerId: data._id, projectLocation: { state: req.body.propertyStateAddress, city: req.body.propertyCityAddress, locality: req.body.propertyLocalityAddress } }
            }
            else if (isDeveloper._id) {
                propertyDeveloperId = { propertyDeveloperId: isDeveloper._id }
            }
        }
        if (req.body.projectName) {
            const isProject = await findProject({ projectName: req.body.projectName });
            if (!isProject) {
                const data = await createProject(project);
                propertyProjectId = { propertyProjectId: data._id }
            }
            else if (isProject._id) {
                propertyProjectId = { propertyProjectId: isProject._id }
            }
        }

        if (req.body.projectName) {
            req.body = { ...req.body, ...propertyProjectId }
        }
        if (req.body.developerName) {
            req.body = { ...req.body, ...propertyDeveloperId }
        }
        if (!propertyData) {
            return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
        }
        const propertyUpdatedData = await updateProperty(req, propertyData);
        return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, propertyUpdatedData));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));

    }
}

/**
 * 
 *  @author - atul singh chauhan
 * @propertyImageFlag - property Image Flag
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.propertyImageFlag = async function (req, res) {
    try {

        const Data = await property.findOne({ "propertyImage._id": req.body._id })
        const propertyData = await property.findOneAndUpdate(
            { "propertyImage._id": req.body._id },
            { $set: { "propertyImage.$.verifiedflag": true } },
            { new: true }
        )
        if (!propertyData) {
            return res.json(response.failure(204, message.serverResponseMessage.dataNotExist));
        }
        return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, propertyData));

    } catch (error) {
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));

    }
}


/**
 * @author - atul singh chauhan
 * @showAllProperty - show new property
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.showNewsFeedProperty = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await featchNewsFeed(req, limit, page);
        const wishListData = await wishListProperty(req.user._id)
        data.forEach((element, index) => {
            const wishData = wishListData.find(ele => {
                return ele.propertyId.equals(element._id)
            })
            wishData ? data[index].isBookMarked = true : data[index].isBookMarked = false
        });
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        console.log(error);
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};



/**
 * @author - atul singh chauhan
 * @filterProperty - filterProperty
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.filterProperty = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await filterPropertyData(req, limit, page);
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @filterProperty - filterProperty
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.filterBroker = async function (req, res) {

    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await filterBrokerData(req, limit, page);
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @getBrokerPropertyDetails - Get Broker Property Details
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getBrokerPropertyDetails = async function (req, res) {
    try {

        if (req.user.group == 2) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1 && req.query.brokerId) {
            var brokerId = req.query.brokerId;
        }
        else if (req.user.group == 1) {
            var brokerId = req.user._id;
        }
        const brokerData = await featchBrokerProperty(req,brokerId, req.query.propertyId);
        const wishListData = await wishListProperty(req.user._id)
        const callReqdatas = await callReqData(req.user._id)
        brokerData.forEach((element, index) => {
            const wishData = wishListData.find(ele => {
                return ele.propertyId.equals(element._id)
            })
            wishData ? brokerData[index].isBookMarked = true : brokerData[index].isBookMarked = false
        });
        brokerData.forEach((element, index) => {
            const reqData = callReqdatas.find(ele => {
                return ele.propertyId.equals(element._id)
            })
            reqData ? brokerData[index].isCallRequested = true : brokerData[index].isCallRequested = false
        });
        if (brokerData.length) return res.json(response.success(200, message.serverResponseMessage.DATA_READ, brokerData));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


/**
 * @author - atul singh chauhan
 * @developerAndPropertyFilter - Developer And Property Filter
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.developerAndPropertyFilter = async function (req, res) {
    try {
        const data = await fetchDeveloperAndPropertyFilter(req);
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.PROJECT_DEVELOPER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.PROJECT_DEVELOPER_READ_ERROR));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
}




