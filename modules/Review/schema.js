const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const reViewSchema = new Schema(
    {
        rating: { type: Number },
        review: { type: String },
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        reviewTo: { type: Schema.Types.ObjectId, ref: 'brokers' }, //auth user/token user
        reviewFor: { type: Schema.Types.ObjectId, ref: 'brokers' }, 
        isActive: { type: Boolean, default: true }
    },
    {
        timestamps: true,
    }
);
const reView = mongoose.model("reView", reViewSchema);

module.exports = reView;