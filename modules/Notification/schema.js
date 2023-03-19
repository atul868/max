const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationCallRequest = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        title: { type: String, },
        body: { type: String, },
        isDelete: { type: Boolean, default: false },
    },
    { timestamps: true }
);

const notificationProperty = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        title: { type: String, },
        body: { type: String, },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const notificationFollow = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        title: { type: String, },
        body: { type: String, },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const notificationVerify = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        title: { type: String, },
        body: { type: String, },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);


const notificationModel = new Schema(
    {
        brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
        requestedBy: { type: Schema.Types.ObjectId, ref: 'brokers' },
        propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
        title: { type: String, },
        body: { type: String, },
        type: { type: String, },
        isDelete: { type: Boolean, default: false },
    },
    {
        timestamps: true,
    }
);

const notifications = mongoose.model("notifications", notificationModel);


const callRequestNotification = mongoose.model("callRequestNotification", notificationCallRequest);
const propertyNotification = mongoose.model("propertyNotification", notificationProperty);
const followNotification = mongoose.model("followNotification", notificationFollow);

const verifyNotification = mongoose.model("verifyNotification", notificationVerify);

module.exports = { callRequestNotification, propertyNotification, followNotification, verifyNotification, notifications };

// const notificationSchema = new Schema(
//     {
//         title: { type: String, },
//         body: { type: String, },
//         startDate: { type: Date, },
//         endDate: { type: Date },
//         image: { type: String },
//         users: { type: Array, default: [] },
//         topic: { type: String, default: 'general' },
//         // propertyId: { type: Schema.Types.ObjectId, ref: 'property' },
//         // brokerId: { type: Schema.Types.ObjectId, ref: 'brokers' },
//         isActive: { type: Boolean, default: true }
//     },
//     {
//         timestamps: true,
//     }

// );
// const notification = mongoose.model("notification", notificationSchema);

// module.exports = notification;