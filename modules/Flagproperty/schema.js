const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const flagSchema = new Schema(
    {
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        isActive: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const flag = mongoose.model("flag", flagSchema);

module.exports = flag;
