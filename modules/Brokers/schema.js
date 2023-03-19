const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const brokerSchema = new Schema(
  {
    fullName: { type: String, },
    email: { type: String, },
    mobile: { type:String  },
    otp: { type: Number, },
    dob: { type: String },
    // officeBuilding: { type: String },//office address
    officeState: { type: String },//office address
    officeCity: { type: String },
    officeLocality: { type: String },//office address// we need to one field locality
    profileImage: { type: String },//profilePic
    uploadBusinessCard: { type: String },
    companyName: { type: String },
    gstNo: { type: String },
    reraNo: { type: String },
    dealIn: [{ type: String }],//array of enum = deal in
    // selector: { type: String, enum: ['Residential','Commercial','Land/plots','Building'] },//array of enum-- specializationType 
    selector: [{ type: String }],//array of enum-- specializationType 
    // specializationSubType: { type: String, enum: ['landDeals', 'plots', 'groupHousing', 'builderFloor', 'kothiBunglow'] },//specializationSubType 
    specializationSubType: [{ type: String }],
    intrestState: [{ type: String }],// area of specializationType  state-- array of string and also apply filter on multiple state && dealing addresh
    interestCity: [{ type: String }],//area of specializationType  city-- array of string and also apply filter on multiple city
    dealLocality: [{ type: String }],//area of specializationType  locality-- array of string and also apply filter on multiple Locality
    subCategory: [{ type: String }], // new added
    // projectExperties: { type: String }, // new added
    developerId: [{ type: Schema.Types.ObjectId, ref: 'propertyDevelopers' }], // builder id
    projectId: [{ type: Schema.Types.ObjectId, ref: 'propertyProjects' }], // builder id
    token: { type: String }, // notification device token
    authToken: { type: String }, // auth token
    group: { type: Number },//we need to discuss on that
    isRegisterd: { type: Boolean, default: true },//we need discuss
    isGeneralVerified: { type: Boolean, default: false },
    isProfileVerifyRequeste: { type: Boolean, default: false },
    isProfileVerify: { type: Boolean, default: false },
    isSuper: { type: Boolean, default: false },
    superBrokerCity: { type: String },
    superBrokerLocality: { type: String },
    superBrokerState: { type: String },
    password: { type: String },
    language:[{ type: String }],
    isActive: { type: Boolean, default: false }
  },
  { timestamps: true }
);

const broker = mongoose.model("broker", brokerSchema);

module.exports = broker;

