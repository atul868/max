const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const followSchema = new Schema(
    {
        followTo: { type: Schema.Types.ObjectId, ref: 'brokers' },
        followFor: { type: Schema.Types.ObjectId, ref: 'brokers' },   
    },
    {
        timestamps: true,
    }

);
const follow = mongoose.model("follow", followSchema);

module.exports = follow;