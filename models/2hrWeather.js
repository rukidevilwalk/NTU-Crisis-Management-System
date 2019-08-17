/* Author(s): Chiam Jack How */
const mongoose = require('mongoose');

const { Schema } = mongoose;

const twohrWeatherSchema = new Schema({
    area: String,
    lat: Number,
    lng: Number,
    timestamp: String,
    forecast: String
});

mongoose.model("twohrWeather", twohrWeatherSchema);