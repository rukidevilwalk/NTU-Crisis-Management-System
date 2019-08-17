/* Author(s): Chiam Jack How */
const request = require("request-promise")
const mongoose = require("mongoose")
const dateformat = require("dateformat")

const Incidents = mongoose.model("incidents")
const IncidentReporter = mongoose.model("incident_reporter")
const IncidentDetails = mongoose.model("incident_details")

const googleMapsClient = require("@google/maps").createClient({
    key: "AIzaSyBF4WjJ3DouooGH4bXx7r8P-vMcy1kGxbo",
    Promise: Promise
})

exports.getIncidents = function () {
    return new Promise(function (resolve, reject) {
        var incidentsArr = []
        var newIncident = {}
        Incidents.find({})
            .populate('incident_details')
            .populate('incident_reporter')
            .sort([
                ['_id', -1]
            ])
            .exec(function (err, data) {
                if (err) {
                    reject(err)
                } else if (data === undefined || data.length == 0) {
                    resolve(data)
                } else {
                    for (let incident of data) {

                        newIncident = {
                            reporter_name: incident.incident_reporter.reporter_name,
                            reporter_email: incident.incident_reporter.reporter_email,
                            reporter_contact_number: incident.incident_reporter.reporter_contact_number,
                            incident_id: incident._id,
                            incident_name: incident.incident_name,
                            incident_location: incident.incident_location,
                            incident_lat: incident.incident_lat,
                            incident_lng: incident.incident_lng,
                            incident_description: incident.incident_description,
                            incident_crisis_level: incident.incident_details.crisis_level,
                            incident_status: incident.incident_details.incident_status,
                            incident_activities: incident.incident_details.incident_activities,
                            incident_date_created: incident.incident_details.date_created,
                            incident_date_resolved: incident.incident_details.date_resolved
                        }

                        incidentsArr.push(newIncident)

                    }
                    resolve(incidentsArr)
                }
            })

    }).catch(err => {
        console.log(err)
    })
}

exports.uploadIncident = function (incidentData) {
    return new Promise(function (resolve, reject) {
        const timestamp = new Date()

        // Convert location to lat and lng
        var response = googleMapsClient.geocode({
                address: incidentData.location
            })
            .asPromise()
            .then((response) => {
                latlng = response.json.results[0].geometry.location

                if (incidentData.reporter_name != "") {
                    var incident_reporter = new IncidentReporter({
                        _id: new mongoose.Types.ObjectId(),
                        reporter_name: incidentData.name,
                        reporter_email: incidentData.email,
                        reporter_contact_number: incidentData.contact

                    })

                    incident_reporter.save(function (err) {
                        if (err) {
                            console.log("Incidents database entry not successfull.")
                            console.log("Error: " + err)
                            reject(err)
                        }
                        saveIncident(incident_reporter._id)
                    })
                } else {
                    saveIncident("")
                }

                function saveIncident(incident_report_id) {

                    var incident_details = new IncidentDetails({
                        _id: new mongoose.Types.ObjectId(),
                        incident_activities: "None",
                        date_created: new Date(),
                        date_resolved: new Date()
                    })


                    incident_details.save(function (err) {
                        if (err) {
                            console.log("Incidents database entry not successfull.")
                            console.log("Error: " + err)
                            reject(err)
                        }

                        var incident = new Incidents({
                            _id: new mongoose.Types.ObjectId(),
                            incident_location: incidentData.location,
                            incident_lat: latlng.lat,
                            incident_lng: latlng.lng,
                            incident_name: incidentData.crisis,
                            incident_description: incidentData.description,
                            incident_details: incident_details._id,
                            incident_reporter: incident_report_id

                        })


                        incident.save(function (err) {
                            if (err) {
                                console.log("Incidents database entry not successfull.")
                                console.log("Error: " + err)
                                reject(err)
                            }
                            resolve("Update successful")
                        })
                    })
                }


            }).catch((err) => {
                console.log(err)
            })


    }).catch((err) => {
        console.log(err)
    })

}

exports.updateIncidentCrisisLevel = function (data) {
    return new Promise(function (resolve, reject) {

        for (var i = 0; i < data.updateList.length; i++) {
            newCrisisLevel = data.updateList[i][1]
            Incidents.findById(data.updateList[i][0], function (err, incident) {
                if (err) {
                    reject(err)
                }
                //   
                IncidentDetails.findById(incident.incident_details, function (err, incident_details) {
                    if (err) {
                        reject(err)
                    }

                    incident_details.crisis_level = newCrisisLevel
                    incident_details.save(function (err, incident) {
                        if (err) {
                            reject(err)
                        }
                        resolve("Success")
                    })

                })

            })
        }


    }).catch(err => {
        console.log(err)
    })
}

exports.updateIncidentActionsTaken = function (data) {
    return new Promise(function (resolve, reject) {

        activities = data.actions_taken

        Incidents.findById(data.incident_id, function (err, incident) {
            if (err) {
                reject(err)
            }

            IncidentDetails.findById(incident.incident_details, function (err, incident_details) {
                if (err) {
                    reject(err)
                }
                if (incident_details.incident_activities !== "None")
                    temp = incident_details.incident_activities + ","
                else
                    temp = ""

                incident_details.incident_activities = temp + activities
                incident_details.save(function (err, incident) {
                    if (err) {
                        reject(err)
                    }
                    resolve("Success")
                })

            })

        })



    }).catch(err => {
        console.log(err)
    })
}

exports.updateIncidentStatus = function (data) {
    return new Promise(function (resolve, reject) {

        for (var i = 0; i < data.updateList.length; i++) {

            Incidents.findById(data.updateList[i], function (err, incident) {
                if (err) {
                    reject(err)
                }

                IncidentDetails.findById(incident.incident_details, function (err, incident_details) {
                    if (err) {
                        reject(err)
                    }


                    incident_details.incident_status = "RESOLVED"
                    incident_details.date_resolved = new Date()
                    incident_details.save(function (err, incident) {
                        if (err) {
                            reject(err)
                        }
                        resolve("Success")
                    })

                })

            })
        }


    }).catch(err => {
        console.log(err)
    })
}

exports.getReportIncidents = function (type) {

    return new Promise(function (resolve, reject) {
        type === "ONGOING" ? ongoingStr = 'ONGOING' : ongoingStr = 'RESOLVED'

        exports.getIncidents().then(function (results) {
            var reportIncidentsArr = []
            for (var i = 0; i < results.length; i++) {
                result = results[i]
                // console.log("RESULT" , result)
                // console.log("STATUS" , result.incident_status)
                if (result.incident_status === ongoingStr) {
                    reportIncidentsArr.push(result)
                    // console.log("reported incidents A " , reportIncidentsArr)
                }
            }
            resolve(reportIncidentsArr)
        })
    })
}