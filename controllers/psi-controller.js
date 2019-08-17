/* Author(s): Chiam Jack How */
const request = require("request-promise")
const mongoose = require("mongoose")
const dateformat = require("dateformat")

const PSI = mongoose.model("PSI")

exports.getPSI = function () {
    return new Promise(function (resolve, reject) {
        const psiArr = []
        PSI.find({}, function (err, data) {
            if (err) {
                reject(err)
            } else if (data === undefined || data.length == 0) {
                resolve("empty")
            } else {
                for (let psi of data) {
                    const newpsi = {
                        region: psi["region"],
                        lat: psi["lat"],
                        lng: psi["lng"],
                        updateDate: psi["updateDate"],
                        o3_sub_index: psi["o3_sub_index"],
                        pm10_twenty_four_hourly: psi["pm10_twenty_four_hourly"],
                        pm10_sub_index: psi["pm10_sub_index"],
                        co_sub_index: psi["co_sub_index"],
                        pm25_twenty_four_hourly: psi["pm25_twenty_four_hourly"],
                        so2_sub_index: psi["so2_sub_index"],
                        co_eight_hour_max: psi["co_eight_hour_max"],
                        no2_one_hour_max: psi["no2_one_hour_max"],
                        so2_twenty_four_hourly: psi["so2_twenty_four_hourly"],
                        pm25_sub_index: psi["pm25_sub_index"],
                        psi_twenty_four_hourly: psi["psi_twenty_four_hourly"],
                        o3_eight_hour_max: psi["o3_eight_hour_max"]
                    }
                    psiArr.push(newpsi)
                }
                resolve(psiArr)
            }
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.populatePSI = function () {

    pullPSIData(function (result) {
        if (result != null) {

            // Loop through all regions
            for (let i = 0; i < result.region_metadata.length; i++) {
                var region = result.region_metadata[i].name
                PSI.updateOne(
                    { "region": result.region_metadata[i].name },
                    {
                        $set:
                        {
                            "region": result.region_metadata[i].name,
                            "lat": result.region_metadata[i].label_location.latitude,
                            "lng": result.region_metadata[i].label_location.longitude,
                            "updateDate": dateformat(result.items[0].update_timestamp, "mmmm dS yyyy, h:MM:ss TT"),
                            "o3_sub_index": result.items[0].readings.o3_sub_index[region],
                            "pm10_twenty_four_hourly": result.items[0].readings.pm10_twenty_four_hourly[region],
                            "pm10_sub_index": result.items[0].readings.pm10_sub_index[region],
                            "co_sub_index": result.items[0].readings.co_sub_index[region],
                            "pm25_twenty_four_hourly": result.items[0].readings.pm25_twenty_four_hourly[region],
                            "so2_sub_index": result.items[0].readings.so2_sub_index[region],
                            "co_eight_hour_max": result.items[0].readings.co_eight_hour_max[region],
                            "no2_one_hour_max": result.items[0].readings.no2_one_hour_max[region],
                            "so2_twenty_four_hourly": result.items[0].readings.so2_twenty_four_hourly[region],
                            "pm25_sub_index": result.items[0].readings.pm25_sub_index[region],
                            "psi_twenty_four_hourly": result.items[0].readings.psi_twenty_four_hourly[region],
                            "o3_eight_hour_max": result.items[0].readings.o3_eight_hour_max[region]
                        }
                    },
                    { upsert: true ,new:true})
                    .then((result) => {
                        //console.log('Updated - ' + result);

                    }).catch((err) => {
                        console.log("Error: " + err)
                    })
            }
        } else {
            console.log("PSI db update error on" + new Date())
        }
    })

}

function pullPSIData(callback) {
    const url = "https://api.data.gov.sg/v1/environment/psi"
    const options = {
        url: url,
        json: true,
        resolveWithFullResponse: true
    }

    request(options)
        .then(function (response) {
            if (response.statusCode != 200) {
                console.log("PSI API request error:" + response.statusCode)
                console.log(response.body)
                return callback(null)
            } else {
                return callback(response.body)
            }
        }).catch(err => {
            console.log(err)
        })
}