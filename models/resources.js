/* Author(s): Chiam Jack How */
const mongoose = require('mongoose')

const { Schema } = mongoose

const resourcesSchema = new Schema({
    _id: Schema.Types.ObjectId,
    resource_name: String,
    resource_email: String,
    resource_tel: String,
    resource_sms: String,
    resource_purpose: String
 
}, {
    timestamps: true
})

mongoose.model("resources", resourcesSchema)