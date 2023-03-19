const hasRole = require('../../middlewares/hasRole');
const middleware = require('../../middlewares/middleware');
const auth = require('../../utils/auth');
const authCheck = auth.jwt;

var fs = require("fs");
// var express = require("express");
// var router = express.Router();
// const controller = require("./controller");

const multer = require("multer");
const path = require("path");

var dir = path.resolve("./uploads");
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});
const upload = multer({
  storage: storage
});


const { getState, getCity, createLocality, getLocality, updateLocality, deleteLocality, imageUpload,addLocality,addCity,updateDeviceToken,addBroker,addDeveloper } = require('./controller')
const { createLocalityValidate, updateLocalityValidate } = require('./vailidator')
module.exports = (app) => {

  app.post('/addLocality',upload.any(), authCheck, hasRole([1]), addLocality);
  app.post('/addCity', upload.any(),authCheck, hasRole([1]), addCity);
  app.post('/addBroker',upload.any(), authCheck, hasRole([1]), addBroker);
  app.post('/addDeveloper', upload.any(),authCheck, hasRole([1]), addDeveloper);


  app.get('/getState', authCheck, hasRole([1, 2]), getState);
  app.get('/getCity', authCheck, hasRole([1, 2]), getCity);

  app.post('/createLocality', authCheck, hasRole([2]), middleware(createLocalityValidate), createLocality);
  app.get('/getLocality', authCheck, hasRole([1, 2]), getLocality);
  app.put('/updateLocality', authCheck, hasRole([2]), middleware(updateLocalityValidate), updateLocality);
  app.delete('/deleteLocality/:id', authCheck, hasRole([2]), deleteLocality);

  app.post("/files", upload.any(), (req, res) => {
    let data = {
      files: req.files
    };
    imageUpload(data, res);
  });

  app.put("/updateDeviceToken/:_id", (req, res) => { // notification device token store
    let data = {
      body: req.body,
      params: req.params
    };
    updateDeviceToken(data, res);
  });

};











