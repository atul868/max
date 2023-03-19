const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const callRequestSchema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        requestBy: { type: Schema.Types.ObjectId, ref: 'brokers' },
        requestFor: { type: Schema.Types.ObjectId, ref: 'brokers' },
        isActive: { type: Boolean, default: false }
    },
    {
        timestamps: true,
    }

);
const callRequest = mongoose.model("callRequest", callRequestSchema);

module.exports = callRequest;