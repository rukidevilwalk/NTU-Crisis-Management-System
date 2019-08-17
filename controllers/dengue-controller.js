/* Author(s): Chiam Jack How */
const request = require("request-promise")
const tj = require("@mapbox/togeojson")
const mongoose = require("mongoose")

const dengueClusters = mongoose.model("dengueClusters")

exports.getDengueClusters = function () {
    return new Promise(function (resolve, reject) {
        const dengueClustersArr = []
        dengueClusters.find({}, function (err, data) {
            if (err) {
                reject(err)
		    } else if (data === undefined || data.length == 0) {
                resolve(data)
            } else {
                for (let dengueCluster of data) {
                    const newdengueCluster = {
                        location: dengueCluster["location"],
                        numOfCases: dengueCluster["numOfCases"],
                        coordinates: dengueCluster["coordinates"],
                        timestamp: dengueCluster["timestamp"]
                    }
                    dengueClustersArr.push(newdengueCluster)
                }
                resolve(dengueClustersArr)

            }
        })
    }).catch(err => {
        console.log(err)
    })
}

exports.populateDengueClusters = function () {

    pullDengueData(function (result) {
        if (result != null) {

            const timestamp = new Date()
            dengueClusters.deleteMany({}, function (err) {
                if (err)
                    console.log(err)

            }).then(() => {
                const converted = tj.kml(toDOM(result))
                // Loop through all clusters
                for (let clusters of converted.features) {

                    const coordArr = []
                    // Loop through all latlng of each cluster
                    for (let coordinates of clusters.geometry.coordinates[0]) {
                        //Store latlng in array
                        coordArr.push(coordinates[1], coordinates[0])
                    }

                    const dengueCluster = {
                        "location": clusters.properties.LOCALITY,
                        "numOfCases": clusters.properties.CASE_SIZE,
                        "coordinates": coordArr,
                        "timestamp": timestamp
                    }

                    dengueClusters.create(dengueCluster, function (err, result) {
                        if (err) {
                            console.log("Dengue Clusters database entry not successfull.")
                            console.log("Error: " + err)

                        } else {
                            //	console.log('Updating dengue clusters db...');
                            //	console.log(result);
                        }
                    })

                }
            })

        } else {
            console.log("Dengue clusters db update error on" + new Date())
        }
    })

}

function pullDengueData(callback) {
    const url = "https://data.gov.sg/api/action/package_show?id=dengue-clusters"
    const options = {
        url: url,
        json: true,
        resolveWithFullResponse: true
    }

    request(options)
        .then(function (response) {
            const kmlurl = response.body["result"].resources[0].url

            const options = {
                url: kmlurl,
                json: true,
                resolveWithFullResponse: true
            }

            request(options)
                .then(function (response) {
                    if (response.statusCode != 200) {
                        console.log("Dengue clusters API request error:" + response.statusCode)
                        console.log(response.body)
                        return callback(null)
                    } else {
                        return callback(response.body)
                    }
                }).catch(err => {
                    console.log(err)
                })
        })

}

// Convert KML to GeoJSON
function toDOM(_) {
    if (!process.browser) {
        var xmldom = require("xmldom")
    }
    if (typeof DOMParser === "undefined") {
        return (new xmldom.DOMParser()).parseFromString(_.toString())
    } else {
        return (new DOMParser()).parseFromString(_, "text/xml")
    }
}