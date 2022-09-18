const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BannerSchema = new Schema(
    {
        image: String,
        rowLocation: String,
        redirectLink: String,  
    },
    {timestamps: true, versionKey: false},
)

module.exports = mongoose.model('Banners', BannerSchema, 'Banners')