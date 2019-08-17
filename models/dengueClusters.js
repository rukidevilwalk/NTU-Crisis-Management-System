/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const dengueClustersSchema = new Schema({
    location: String,
    numOfCases: String,
    coordinates: [[Number, Number]],
    timestamp: Date
  });
  
mongoose.model("dengueClusters", dengueClustersSchema);