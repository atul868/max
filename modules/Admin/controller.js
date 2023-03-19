const bcrypt = require('bcrypt');
const auth = require("../../utils/auth");
const generateToken = auth.generateToken;
const message = require('../../config/message');
const response = require('../../utils/response');
const Model = require('../Brokers/schema');
const { ObjectId } = require('mongoose').Types;
const { createDeveloper, getDeveloper, superBrokerAssign, updateDeveloper, deleteDeveloper,
    findDeveloper, createProject, getProject, updateProject, deleteProject, findProject,
    propertySearch, brokerSearch, adminpropertyFilter, brokerFilter, developerSearch,
    developerFilter, projectSearch, projectFilter, showAllDeveloper, showAllProject,
    searchState, searchCity, searchLocality, propertyFilter
} = require('./dbQuery')
const { findBroker } = require('../Brokers/dbQuery');
const { getBrokerFollower } = require('../Followers/dbQuery');


/**
 *@author - atul singh chauhan
 * @adminLogin - Admin Login
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.adminLogin = async function (req, res) {
    try {
        const { email, password } = req.body;
        const userData = await Model.findOne({ email: email });
        if (!userData) return res.json(response.success(204, message.serverResponseMessage.ADMIN_DOES_NOT_EXISTS));
        const result = await bcrypt.compare(password, userData.password);
        if (!result)
            return res.json(response.success(204, message.serverResponseMessage.PASSWORD_INCORRECT));
        const token = generateToken({ userId: userData._id });
        userData.authToken = token;
        await userData.save();
        return res.json(response.success(200, message.serverResponseMessage.ADMIN_LOGIN, { token: token }));


    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


/**
 *@author - atul singh chauhan
 * @adminLogout - Admin Logout
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.adminLogout = async function (req, res) {
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

/**
 * @author - atul singh chauhan
 * @createPropertyDeveloper - Create Property Developer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.createPropertyDeveloper = async function (req, res) {
    try {
        const isDeveloper = await findDeveloper({ developeName: req.body.developeName });
        console.log(isDeveloper);
        if (!isDeveloper) {
            const data = await createDeveloper(req.body);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_CREATED, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_CREATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_DEVELOPER_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @getPropertyDeveloper - Get Property Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */

exports.getPropertyDeveloper = async function (req, res) {
    try {
        const data = await getDeveloper(req);
        if (data)
            return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @getAllDeveloper - Get All Developer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getAllDeveloper = async function (req, res) {
    try {
        const data = await showAllDeveloper(req.query.id);
        if (data)
            return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @getAllProject - Get All Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getAllProject = async function (req, res) {
    try {
        const data = await showAllProject(req.query.id);
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}//getAllProject

/**
 * @author - atul singh chauhan
 * @updatePropertyDeveloper - Update Property Developer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updatePropertyDeveloper = async function (req, res,) {
    try {
        const isDeveloper = await findDeveloper({ _id: req.body.id });
        if (isDeveloper) {
            const data = await updateDeveloper(req.body, isDeveloper);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_UPDATE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_UPDATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_DEVELOPER_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @deletePropertyDeveloper - Delete Property Developer
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deletePropertyDeveloper = async function (req, res) {
    try {
        const id = req.params.id;
        const isDeveloper = await findDeveloper({ _id: req.params.id });
        if (isDeveloper && id) {
            const data = await deleteDeveloper(req.params.id);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_DELETE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_DEVELOPER_DELETE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_DEVELOPER_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
/**
 * @author - atul singh chauhan
 * @createPropertyProject - Create Property Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.createPropertyProject = async function (req, res) {
    try {

        const isProject = await findProject({ projectName: req.body.projectName });
        if (!isProject) {
            const data = await createProject(req.body);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_PROJECT_CREATED, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_PROJECT_CREATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_PROJECT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
/**
 * @author - atul singh chauhan
 * @getPropertyProject - Get Property Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.getPropertyProject = async function (req, res) {
    try {
        const data = await getProject(req);
        if (data)
            return res.json(response.success(200, message.serverResponseMessage.PROPERTY_PROJECT_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_PROJECT_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @updatePropertyProject - Update Property Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.updatePropertyProject = async function (req, res) {
    try {
        const isProject = await findProject({ _id: req.body.id });
        if (isProject) {
            const data = await updateProject(req.body, isProject);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_PROJECT_UPDATE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_PROJECT_UPDATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_PROJECT_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
/**
 * @author - atul singh chauhan
 * @deletePropertyProject - Delete Property Project
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.deletePropertyProject = async function (req, res) {
    try {
        const id = req.params.id;
        const isProject = await findProject({ _id: req.params.id });

        if (isProject && id) {
            const data = await deleteProject(req.params.id);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.PROPERTY_PROJECT_DELETE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_PROJECT_DELETE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.PROPERTY_PROJECT_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @assignSuperBroker - Assign Super Broker
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.assignSuperBroker = async function (req, res) {
    // console.log(req.body);
    try {
        if (req.user.group == 2) {
            var brokerId = req.body.brokerId;
        }
        const brokerData = await findBroker({ _id: new ObjectId(brokerId) });
        if (!brokerData) {
            return res.json(response.failure(204, message.serverResponseMessage.brokerNotExist));
        }
        if (brokerData.isSuper == false && brokerData.isProfileVerify == true ) {
            brokerData.isSuper = true,
                brokerData.superBrokerState = req.body.superBrokerState ? req.body.superBrokerState : brokerData.superBrokerState;
            brokerData.superBrokerCity = req.body.superBrokerCity ? req.body.superBrokerCity : brokerData.superBrokerCity;
            brokerData.superBrokerLocality = req.body.superBrokerLocality ? req.body.superBrokerLocality : brokerData.superBrokerLocality;
            const data = await superBrokerAssign(brokerData);
            return res.json(response.success(200, message.serverResponseMessage.SUPER_BROKER, data));
        }
        else {
            return res.json(response.success(204, message.serverResponseMessage.SUPER_BROKER_W));
        }

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(404, message.serverResponseMessage.Catch_Error, error));
    }
}

/**
 * @author - atul singh chauhan
 * @propertySearchAdmin - property Search for admin
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.propertySearchAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const { isSearch, isFilter } = req.body;
        let Response;
        if (isSearch) Response = await propertySearch(req, limit, page);
        if (isFilter) Response = await propertyFilter(req, limit, page);

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
 * @brokerSearchAdmin - Broker Search Admin
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.brokerGet = async function (req, res) {
    try {
        let limit = 10;
        var page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data1 = await brokerSearch(req, limit, page);
        if (req.user.group == 1) {
            let data = [...data1[0]];
            const followData = await getBrokerFollower(req.user._id)
            data.forEach((element, index) => {
                const followerData = followData.find(ele => {
                    return ele.followFor.equals(element._id)
                })
                console.log(followerData);
                followerData ? data[index].isFollowed = true : data[index].isFollowed = false
            });
            if (data.length)
                return res.json(response.Success(200, data1[1], message.serverResponseMessage.TOP_BROKER_READ, data));
            else return res.json(response.Success(204, data1[1], message.serverResponseMessage.FAILURE_TOP_BROKER_READ,data));
        }
        else if (req.user.group == 2) {
            if (data1.length)
                return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data1));
            else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
        }


    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @propertyFilterAdmin - property Filter for Admin
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.propertyFilterAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await adminpropertyFilter(req, limit, page);
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
 * @brokerFilterAdmin - Broker Filter for Admin
 * @param {*} req 
 * @param {*} res 
 * @returns 
 */
exports.brokerFilterAdmin = async function (req, res) {

    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await brokerFilter(req, limit, page);
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/* developer get search and filter comman api */
exports.developerSearchAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        console.log(req.query);
        const data = await developerSearch(req, limit, page);
        // let searchResult = data.length;
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.PROPERTY_DEVELOPER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.PROPERTY_DEVELOPER_READ_ERROR));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};


/**
 * @author - atul singh chauhan
 * @developerFilterAdmin - Developer Filter Admin
 * @param {*} req  
 * @param {*} res 
 * @returns 
 */
exports.developerFilterAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await developerFilter(req, limit, page);
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
 * @projectSearchAdmin - Project Search for Admin
 * @param {*} req  
 * @param {*} res 
 * @returns 
 */

exports.projectSearchAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await projectSearch(req, limit, page);
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.PROJECT_DEVELOPER_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.PROJECT_DEVELOPER_READ_ERROR));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

/**
 * @author - atul singh chauhan
 * @projectFilterAdmin - Project Filter Admin
 * @param {*} req  
 * @param {*} res 
 * @returns 
 */
exports.projectFilterAdmin = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, req.body.page);
        if (req.body.limit) {
            limit = req.body.limit;
        }
        const data = await projectFilter(req, limit, page);
        if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

exports.stateSearch = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await searchState(req, limit, page);
        let searchResult = data.length;
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.STATE_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_STATE_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

exports.citySearch = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await searchCity(req, limit, page);
        let searchResult = data.length;
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.CITY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.FAILURE_CITY_READ));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

exports.localitySearch = async function (req, res) {
    try {
        let limit = 10;
        const page = Math.max(0, Number(req.query.page));
        if (Number(req.query.limit)) {
            limit = Number(req.query.limit);
        }
        const data = await searchLocality(req, limit, page);
        let searchResult = data.length;
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.LOCALITY_READ, data));
        else return res.json(response.success(204, message.serverResponseMessage.LOCALITY_READ_ERROR));
    } catch (error) {
        return res.json(
            response.failure(204, message.serverResponseMessage.Catch_Error, error)
        );
    }
};

// exports.profileVerificationSearch = async function (req, res) {
//     // console.log(req.body);
//     try {
//         let limit = 10;
//         const page = Math.max(0, req.body.page);
//         if (req.body.limit) {
//             limit = req.body.limit;
//         }
//         const data = await searchProfileVerification(req, limit, page);
//         console.log(data);
//         let searchResult = data.length;
//         if (data.length)
//             return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data));
//         else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
//     } catch (error) {
//         return res.json(
//             response.failure(204, message.serverResponseMessage.Catch_Error, error)
//         );
//     }
// };

// exports.profileVerificationFilter = async function (req, res) {
//     try {
//         let limit = 10;
//         const page = Math.max(0, req.body.page);
//         if (req.body.limit) {
//             limit = req.body.limit;
//         }
//         const data = await filterProfileVerification(req, limit, page);
//         console.log(data);
//         if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
//         else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
//     } catch (error) {
//         return res.json(
//             response.failure(204, message.serverResponseMessage.Catch_Error, error)
//         );
//     }
// };

// exports.flagPropertySearch = async function (req, res) {
//     // console.log(req.body);
//     try {
//         let limit = 10;
//         const page = Math.max(0, req.body.page);
//         if (req.body.limit) {
//             limit = req.body.limit;
//         }
//         const data = await searchFlagProperty(req, limit, page);
//         console.log(data);
//         let searchResult = data.length;
//         if (data.length)
//             return res.json(response.success(200, message.serverResponseMessage.TOP_BROKER_READ, data));
//         else return res.json(response.success(204, message.serverResponseMessage.FAILURE_TOP_BROKER_READ));
//     } catch (error) {
//         return res.json(
//             response.failure(204, message.serverResponseMessage.Catch_Error, error)
//         );
//     }
// };

// exports.flagPropertyFilter = async function (req, res) {
//     try {
//         let limit = 10;
//         const page = Math.max(0, req.body.page);
//         if (req.body.limit) {
//             limit = req.body.limit;
//         }
//         const data = await filterFlagProperty(req, limit, page);
//         console.log(data);
//         if (data.length) return res.json(response.success(200, message.serverResponseMessage.PROPERTY_READ, data));
//         else return res.json(response.success(204, message.serverResponseMessage.FAILURE_PROPERTY_READ));
//     } catch (error) {
//         return res.json(
//             response.failure(204, message.serverResponseMessage.Catch_Error, error)
//         );
//     }
// };
