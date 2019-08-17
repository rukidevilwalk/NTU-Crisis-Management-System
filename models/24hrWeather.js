/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const twentyfourhrWeatherSchema = new Schema({
    timestamp: String,
    forecast: String,
    relative_humidity_high: Number,
    relative_humidity_low: Number,
    temperature_high: Number,
    temperature_low: Number,
    wind_speed_high: Number,
    wind_speed_low: Number,
    wind_direction: String
});

mongoose.model("twentyfourhrWeather", twentyfourhrWeatherSchema);