import { Schema } from "mongoose";

export let mediaTagSchema: Schema = new Schema({
    secret: {
        name: String,
        image: String
    },
    nameHash: {
        type: String,
        required: true
    },
    prettyName: {
        type: String,
        unique: true
    },
    featured: {
        type: Boolean,
        default: false
    },
    featuredAt: {
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