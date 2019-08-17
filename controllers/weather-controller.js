/* Author(s): Chiam Jack How */
const request = require("request-promise")
const mongoose = require("mongoose")
const dateformat = require("dateformat")

const twentyfourhrWeather = mongoose.model("twentyfourhrWeather")
const twohrWeather = mongoose.model("twohrWeather")

exports.get24hrWeather = function () {
    return new Promise(function (resolve, reject) {
        twentyfourhrWeather.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else if (data === undefined || data.length == 0) {
                resolve("empty")
            } else {
                const weatherData = {
                    timestamp: data[0].timestamp,
                    forecast: data[0].forecast,
                    relative_humidity_high: data[0].relative_humidity_high,
                    relative_humidity_low: data[0].relative_humidity_low,
                    temperature_high: data[0].temperature_high,
                    temperature_low: data[0].temperature_low,
                    wind_speed_high: data[0].wind_speed_high,
                    wind_speed_low: data[0].wind_speed_low,
                    wind_direction: data[0].wind_direction
                }
                resolve(weatherData)
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.get2hrWeather = function () {
    return new Promise(function (resolve, reject) {
        var weatherArr = []
        twohrWeather.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else if (data == null) {
                resolve(data)
            } else {
                for (let area of data) {
                    const weatherData = {
                        area: area.area,
                        lat: area.lat,
                        lng: area.lng,
                        timestamp: area.timestamp,
                        forecast: area.forecast

                    }
                    weatherArr.push(weatherData)
                }

                resolve(weatherArr)
            }
        })
    }).catch(err => {
        console.log(err)
    })
}
exports.populate24hrWeather = function () {
    const url = "https://api.data.gov.sg/v1/environment/24-hour-weather-forecast"
    pullWeather(url, function (result) {
        if (result != null) {

            twentyfourhrWeather.updateOne(
                {},
                {
                    $set:
                    {
                        "timestamp": dateformat(result.items[0].update_timestamp, "mmmm dS yyyy, h:MM:ss TT"),
                        "forecast": result.items[0].general.forecast,
                        "relative_humidity_high": result.items[0].general.relative_humidity.high,
                        "relative_humidity_low": result.items[0].general.relative_humidity.low,
                        "temperature_high": result.items[0].general.temperature.high,
                        "temperature_low": result.items[0].general.temperature.low,
                        "wind_speed_high": result.items[0].general.wind.speed.high,
                        "wind_speed_low": result.items[0].general.wind.speed.low,
                        "wind_direction": result.items[0].general.wind.direction
                    }
                },
                { upsert: true, new: true })
                .then((result) => {
                    //console.log('Updated - ' + result);

                }).catch((err) => {
                    console.log("Error: " + err)
                })

        } else {
            console.log("24hr weather db update error on" + new Date())
        }
    })

}

exports.populate2hrWeather = function () {
    const url = "https://api.data.gov.sg/v1/environment/2-hour-weather-forecast"
    pullWeather(url, function (result) {


        if (result != null) {
            for (let i = 0; i < result.area_metadata.length; i++) {
                var area = result.area_metadata[i].name
                twohrWeather.updateOne(
                    { "area": area },
                    {
                        $set:
                        {
                            "area": result.area_metadata[i].name,
                            "lat": result.area_metadata[i].label_location.latitude,
                            "lng": result.area_metadata[i].label_location.longitude,
                            "timestamp": dateformat(result.items[0].update_timestamp, "mmmm dS yyyy, h:MM:ss TT"),
                            "forecast": result.items[0].forecasts[i].forecast
                        }
                    },
                    { upsert: true, new: true })
                    .then((result) => {
                        //  console.log('Updated - ' + result);

                    }).catch((err) => {
                        console.log("Error: " + err)
                    })
            }
        } else {
            console.log("2hr weather db update error on" + new Date())
        }
    })

}

function pullWeather(url, callback) {


    const options = {
        url: url,
        json: true,
        resolveWithFullResponse: true
    }

    request(options)
        .then(function (response) {
            if (response.statusCode != 200) {
                console.log("Weather API request error:" + response.statusCode)
                console.log(response.body)
                return callback(null)
            } else {
                return callback(response.body)
            }


        }).catch(err => {
            console.log(err)
        })

}