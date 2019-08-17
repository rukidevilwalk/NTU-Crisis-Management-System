/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const {
    Schema
} = mongoose;

const incident_detailsSchema = new Schema({
    _id: Schema.Types.ObjectId,
    incident_status: {
        type: String,
        enum: ['ONGOING', 'RESOLVED'],
        default: 'ONGOING'
    },
    crisis_level: {
        type: Number,
        enum: [0, 1, 2, 3],
        default: 0
    },
    incident_activities: String,
    date_created: Date,
    date_resolved: Date

});

mongoose.model("incident_details", incident_detailsSchema);