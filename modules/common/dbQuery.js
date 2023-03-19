const { ObjectId } = require('mongoose').Types;
const { findOne } = require('../Brokers/schema');
const { state, city, locality } = require('./schema')

/**
* @author - atul singh chauhan
* @featchState - featch State
* @param {*} req 
* @returns 
*/
module.exports.featchState = async () => {
    return await state.find({ 'country_id': 101 }).lean();
}


/**
* @author - atul singh chauhan
* @featchState - find State
* @param {*} req 
* @returns 
*/
module.exports.findCity = async () => {
    return await city.find({'country_id': 101 });
}

/**
* @author - atul singh chauhan
* @featchState - find State
* @param {*} req 
* @returns 
*/
module.exports.findState = async () => {
    return await state.find({ 'country_id': 101 }).lean();
}

/**
* @author - atul singh chauhan
* @featchState - locality Create 
* @param {*} req 
* @returns 
*/
module.exports.localityCreate = async (localityN) => {
    return await locality.create(localityN);
}

/**
* @author - atul singh chauhan
* @featchState - city Create 
* @param {*} req 
* @returns 
*/
module.exports.cityCreate = async (cityN) => {
    return await city.create(cityN);
}

/**
* @author - atul singh chauhan
* @featchCity - featch City
* @param {*} req 
* @returns 
*/
module.exports.featchCity = async (state_id) => {
    return await city.find({ 'state_id': state_id }).lean();
}



/**
 * @author - atul singh chauhan
 * @findLocality - find Locality
 * @param {*} req 
 * @returns 
 */
module.exports.findLocality = async (req) => {
    return await locality.findOne(req);
}

/**
 * @author - atul singh chauhan
 * @addLocality - add Locality
 * @param {*} req 
 * @returns 
 */
module.exports.addLocality = async (req) => {
    return await locality.create(req);
}
/**
* @author - atul singh chauhan
* @showLocality - show Locality
* @param {*} req 
* @returns 
*/
module.exports.showLocality = async (req) => {
    return await locality.find(req).lean();
}



/**
 * @author - atul singh chauhan
 * @updateDeveloper - update Developer
 * @param {*} req 
 * @returns 
 */
module.exports.editLocality = async (req, localityData) => {
    localityData.stateId = req.stateId ? req.stateId : localityData.stateId;
    localityData.cityId = req.cityId ? req.cityId : localityData.cityId;
    localityData.Name = req.Name ? req.Name : localityData.Name;
    return await localityData.save();
}



/**
* @author - atul singh chauhan
* @deleteDeveloper - delete Developer
* @param {*} req 
* @returns 
*/

module.exports.removeLocality = async (req) => {
    console.log(req.params.id);
    return await locality.findByIdAndDelete({ _id: req.params.id });
}