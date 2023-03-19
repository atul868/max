const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const propertyDeveloperSchema = new Schema(
    {
        developeName: { type: String },
        developeLogo: { type: String },
        developeHeadquaterLocation: {
            state: { type: String },
            city: { type: String },
            locality: { type: String },
            // apartment: { type: String }
        },
        isActive: { type: Boolean, default: true }

    },
    { timestamps: true }
);

const propertyProjectSchema = new Schema(
    {
        developerId: { type: Schema.Types.ObjectId, ref: 'propertyDevelopers' }, // builder id
        projectName: { type: String },
        projectLogo: { type: String },
        projectType: { type: String },
        projectLocation: {
            state: { type: String },
            city: { type: String },
            locality: { type: String },
            // apartment: { type: String }
        },
        projectGeoLocation: {
            latitude: { type: String },
            longitude: { type: String },
        },
        projectReraNumber: { type: String },
        projectContactPerson: { type: String },
        projectContactPersonNumber: { type: Number },
        projectmaintenace: { type: String },
        levidByRwaTenantRent: { type: String },
        levidByRwaSaleUnit: { type: String },
        isActive: { type: Boolean, default: true }

        // projectMaintenaceCommercial: { type: String },
        // projectLocation: { type: String }, // apartment building location
    },
    {
        timestamps: true,
    }

);

const propertyDeveloper = mongoose.model("propertyDeveloper", propertyDeveloperSchema);
const propertyproject = mongoose.model("propertyproject", propertyProjectSchema);
module.exports = { propertyDeveloper, propertyproject }
