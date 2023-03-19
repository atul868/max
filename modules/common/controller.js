const bcrypt = require('bcrypt');
const auth = require("../../utils/auth");
const generateToken = auth.generateToken;
const message = require('../../config/message');
const response = require('../../utils/response');
const XLSX = require("xlsx");
const path = require("path");
const fs = require("fs");
const { ObjectId } = require('mongoose').Types;
const { featchState, featchCity, findLocality, addLocality, showLocality, editLocality, cityCreate, removeLocality, findState, findCity, localityCreate } = require('./dbQuery')
const { handleAWSUpload } = require("../../config/s3");
const { createDeveloper } = require('../Admin/dbQuery')//createBroker
const { createBroker } = require('../Brokers/dbQuery')//
const userDb = require("../Brokers/schema");

exports.imageUpload = async function (data, res) {
    try {
        for (let file of data.files) {
            file.path = await handleAWSUpload(file);
        }
        return res.json(response.success(200, message.serverResponseMessage.DATA_CREATED, data));
        // return response.sendSuccess(res, data, messages.files); /* dont remove this */
    } catch (err) {
        console.log(err);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, err));
    }
};

exports.getState = async function (req, res) {
    try {
        const data = await featchState();
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.STATE_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_STATE_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.getCity = async function (req, res) {
    try {
        const data = await featchCity(req.body.state_id);
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.CITY_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_CITY_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.createLocality = async function (req, res) {
    try {
        const isDeveloper = await findLocality({ Name: req.body.Name });
        if (!isDeveloper) {
            const data = await addLocality(req.body);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.LOCALITY_CREATED, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_LOCALITY_CREATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.LOCALITY_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.getLocality = async function (req, res) {
    try {
        const data = await showLocality({ stateId: req.body.stateId, cityId: req.body.cityId });
        if (data.length)
            return res.json(response.success(200, message.serverResponseMessage.LOCALITY_READ, data));
        else
            return res.json(response.success(204, message.serverResponseMessage.FAILURE_LOCALITY_READ));

    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.updateLocality = async function (req, res,) {
    try {
        const isLocality = await findLocality({ _id: req.body.id });
        if (isLocality) {
            const data = await editLocality(req.body, isLocality);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.LOCALITY_UPDATE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_LOCALITY_UPDATE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.LOCALITY_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.deleteLocality = async function (req, res) {
    try {
        const isLocality = await findLocality({ _id: req.params.id });
        console.log(req.params.id);

        if (isLocality) {
            const data = await removeLocality(req);
            if (data)
                return res.json(response.success(200, message.serverResponseMessage.LOCALITY_DELETE, data));
            else
                return res.json(response.success(204, message.serverResponseMessage.FAILURE_LOCALITY_DELETE));
        } else
            return res.json(response.success(204, message.serverResponseMessage.LOCALITY_DOES_NOT_EXISTS));
    } catch (error) {
        console.log(error, 'error')
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


exports.addLocality = async function (req, res) {
    try {
        const allCity = await findCity();
        var workbook = XLSX.readFile(path.resolve(req.files[0].path));
        let data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        );
        data.forEach((element, index) => {
            const wishData = allCity.find(ele => {
                return ele.name == element.cityName

            })
            if (wishData) {
                data[index].stateId = wishData.state_id;
                data[index].cityId = wishData.id;
            }
        });
        const Response = await localityCreate(data);
        if (Response)
            return res.json(response.success(201, 'locality added succesfully', Response));
        else return res.json(response.success(204, 'unable to add locality'));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


exports.addCity = async function (req, res) {
    try {
        const allState = await findState();
        var workbook = XLSX.readFile(path.resolve(req.files[0].path));
        let data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        );
        data.forEach((element, index) => {
            const wishData = allState.find(ele => {
                return ele.name == element.stateName

            })
            if (wishData) {
                data[index].id = new Date().getTime();
                data[index].state_id = wishData.id;
            }
        });
        const Response = await cityCreate(data);
        if (Response)
            return res.json(response.success(201, 'city added succesfully', Response));
        else return res.json(response.success(204, 'unable to add city'));



    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}

exports.addBroker = async function (req, res) {
    try {
        var workbook = XLSX.readFile(path.resolve(req.files[0].path));
        let data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        );
        const Response = await createBroker(data);
        if (Response)
            return res.json(response.success(201, 'broker added succesfully', Response));
        else return res.json(response.success(204, 'unable to add broker'));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}


exports.addDeveloper = async function (req, res) {
    try {
        var workbook = XLSX.readFile(path.resolve(req.files[0].path));
        let data = XLSX.utils.sheet_to_json(
            workbook.Sheets[workbook.SheetNames[0]]
        );
        for(let dataToMan of data){
            dataToMan["developeHeadquaterLocation"]={
                state : dataToMan.state,
                city : dataToMan.city,
                locality : dataToMan.locality,
                // apartment : dataToMan.apartment
            }
        }
        const Response = await createDeveloper(data);
        if (Response)
            return res.json(response.success(201, 'developer added succesfully', Response));
        else return res.json(response.success(204, 'unable to add developer'));

    } catch (error) {
        console.log(error);
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}





exports.updateDeviceToken = async function (req, res) {
    try {
        return new Promise(async (resolve, reject) => {
            const userFind = await userDb.findOne({ _id: req.params._id });
            if (userFind) {
                let user = await userDb.updateOne({ _id: userFind._id }, req.body);
                return resolve(user);
            } else {
                return reject([]);
            }
        })
            .then(async (result) => {
                return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, []));
            })
            .catch(async (error) => {
                console.log(error);
                return res.json(response.failure(204, message.serverResponseMessage.DATA_DOES_NOT_EXISTS, error));
            });
        let user = await Model.updateOne({ _id: req.params._id }, req.body.token);
        return res.json(response.success(200, message.serverResponseMessage.DATA_UPDATE, []));
    } catch (error) {
        return res.json(response.failure(204, message.serverResponseMessage.Catch_Error, error));
    }
}
