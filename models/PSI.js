/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const PSISchema = new Schema({
    region: String,
    lat: Number,
    lng: Number,
    updateDate: String,
    o3_sub_index: Number,
    pm10_twenty_four_hourly: Number,
    pm10_sub_index: Number,
    co_sub_index: Number,
    pm25_twenty_four_hourly: Number,
    so2_sub_index: Number,
    co_eight_hour_max: Number,
    no2_one_hour_max: Number,
    so2_twenty_four_hourly: Number,
    pm25_sub_index: Number,
    psi_twenty_four_hourly: Number,
    o3_eight_hour_max: Number

});

mongoose.model("PSI", PSISchema);