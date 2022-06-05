import { Schema } from "mongoose";

export let mediaSchema: Schema = new Schema({
    secret: {
        sourceLink: String
    },
    name: {
        type: String
    },
    prettyName: {
        type: String,
        unique: true
    },
    note: {
        type: String
    },
    thumbnailLink: {
        type: Array
    },
    minister: [
        {
            type: Schema.Types.ObjectId,
            ref: "Minister"
        }
    ],
    mediaTag: [
        {
            type: Schema.Types.ObjectId,
            ref: "MediaTag"
        }
    ],
    contributing: [
        {
            type: Schema.Types.ObjectId,
            ref: "Minister"
        }
    ],
    mediaChannel: [
        {
            type: Schema.Types.ObjectId,
            ref: "Channel"
        }
    ],
    mediaType: {
        type: String
    },
    description: {
        type: String
    },
    views: {
        type: String
    },
    likes: {
        type: String
    },
    dislikes: {
        type: String
    },
    trending: {
        type: String
    },
    trendingAt: {
        type: Date
    },
    scheduleAt: {
        type: Date,
        default: Date.now
    },
    mediaLength: {
        type: String
    },
    subscribersNotified: {
        type: Date
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


