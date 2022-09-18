const mongoose = require('mongoose')

const Schema = mongoose.Schema

const termsSchema = new Schema(
    {
        _id: { type: String },
        createdAt: {
            type: Date,
            default: Date.now(),
        },
        updatedAt: Date,
        termsncondition: String,
    }
)

module.exports = mongoose.model('terms', termsSchema, 'termsSchema')