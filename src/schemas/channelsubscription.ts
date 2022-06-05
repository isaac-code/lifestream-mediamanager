import { Schema } from "mongoose";

export let channelSubscriptionSchema: Schema = new Schema({
    mediaChannel: [
        {
            type: Schema.Types.ObjectId,
            ref: "Channel"
        }
    ],
    subscribed: {
        type: Boolean,
        default: true
    },
    notifyMe: {
        type: Boolean,
        default: false
    },
    tenantId: {
        type: String
    },
    userId: {
        type: String,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    lastUpdatedAt: {
        type: Date
    },
    isActive: {
        type: Boolean,
        default: false
    }
});

