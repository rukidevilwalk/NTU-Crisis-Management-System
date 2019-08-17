/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const incident_reporterSchema = new Schema({
    _id: Schema.Types.ObjectId,
    reporter_name: String,
    reporter_email: String,
    reporter_contact_number: String
 
}, {
    timestamps: true
});

mongoose.model("incident_reporter", incident_reporterSchema);