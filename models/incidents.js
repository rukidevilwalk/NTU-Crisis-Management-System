/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const incidentsSchema = new Schema({
	_id: Schema.Types.ObjectId,
	incident_name: String,
	incident_location: String,
    incident_lat: Number,
    incident_lng: Number,
    incident_description: String,
   
    incident_reporter: { type: Schema.Types.ObjectId, ref: 'incident_reporter' },
    incident_details: { type: Schema.Types.ObjectId, ref: 'incident_details' }
 
});

mongoose.model("incidents", incidentsSchema);