const mongoose = require('mongoose')
const User = require('./user');

const Schema = mongoose.Schema

const policySchema = new Schema(
    {
        _id: { type: String },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: Date,
        image: String,
        policyName: String,
        description: String,
        userId: { type: String, ref:"User" },
        status: {
            type: String,
            enum: ["ACTIVE", "DELETED", "BLOCKED"],
            default: "ACTIVE"
        },
    }
)

module.exports = mongoose.model('policy', policySchema, 'policies')