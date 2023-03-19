const mongoose = require('mongoose');
mongoose.Promise = require('bluebird');
const config = require('./config/index');

let conString = config.development_databaseURL;
const connect = mongoose.connect(conString, {useNewUrlParser: true, useUnifiedTopology: true});
module.exports = connect;
