const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const stateSchema = new Schema(
    {
        id: { type: Number },
        name: { type: String },
        country_id: { type: Number },
        country_code: { type: String },
        country_name: { type: String },
        state_code: { type: String },
        type: { type: String },
        latitude: { type: String },
        longitude: { type: String },
    },
    { timestamps: true }
);

const citySchema = new Schema(
    {
        id: { type: Number },
        name: { type: String },
        state_id: { type: Number },
        state_code: { type: String },
        country_name: { type: String },
        country_id: { type: Number },
        country_code: { type: String },
        country_name: { type: String },
        state_code: { type: String },
        type: { type: String },
        latitude: { type: String },
        longitude: { type: String },
    },
    {
        timestamps: true,
    }

);
const localitySchema = new Schema(

    {
        stateId: { type: Number },
        cityId: { type: Number },
        Name: { type: String },
        isActive: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }

);

const contactSchema = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        name:{type:String},
        contact: [{ type: Number }],
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);


const state = mongoose.model("state", stateSchema);
const city = mongoose.model("city", citySchema);
const locality = mongoose.model("locality", localitySchema);
const contact = mongoose.model("contact", contactSchema);

module.exports = {
    state, city, locality, contact
}
