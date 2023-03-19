const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const propertyBookMarkSchema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        projectId: { type: Schema.Types.ObjectId, ref: 'propertyprojects' },
        isActive: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }

);
const propertyBookMark = mongoose.model("propertyBookMark", propertyBookMarkSchema);

module.exports = propertyBookMark;