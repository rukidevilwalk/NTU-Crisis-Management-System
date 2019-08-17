/* Author(s): Chiam Jack How */
const weatherController = require("../controllers/weather-controller")
const psiController = require("../controllers/psi-controller")
const dengueController = require("../controllers/dengue-controller")
const incidentsController = require("../controllers/incidents-controller")
const resourcesController = require("../controllers/resources-controller")
const socialMediaController = require("../controllers/socialmedia-controller")
const usersController = require("../controllers/users-controller")
const reportController = require("../controllers/report-controller")

module.exports = function (server) {

    server.on("connection", function (client) {

        //Show connected user
        client.on("showConnectedUser", function (user) {
            console.log(user.name + " has connected")
        })

        // client.on("disconnect", function () {
        //     console.log('A client has disconnected')
        // })

        /*** Dashboard ***/

        // On client connection, tell client to request for data to render in map
        client.emit("getInitData", "Pulling dashboard data")

        /* Server listens for clients' requests to return them data 
        If API data in db is empty on get, request data from api and populate db
        then return the newly populated data to client */
        client.on("get24hrWeather", function (fn) {
            weatherController.get24hrWeather().then(function (results) {
                if (results === "empty") {
                    weatherController.populate24hrWeather().then(function () {
                        weatherController.get24hrWeather().then(function (results) {
                            fn(results)
                        })
                    })
                } else {
                    fn(results)
                }
            })
        })

        client.on("get2hrWeather", function (fn) {
            weatherController.get2hrWeather().then(function (results) {
                if (results === "empty") {
                    weatherController.populate2hrWeather().then(function () {
                        weatherController.get2hrWeather().then(function (results) {
                            fn(results)
                        })
                    })
                } else {
                    fn(results)
                }
            })
        })

        client.on("getPSIData", function (fn) {
            psiController.getPSI().then(function (results) {
                if (results === "empty") {
                    psiController.populatePSI().then(function () {
                        psiController.getPSI().then(function (results) {
                            fn(results)
                        })
                    })
                } else {
                    fn(results)
                }
            })
        })

        client.on("getDengueClusters", function (fn) {
            dengueController.getDengueClusters().then(function (results) {
                if (results === "empty") {
                    dengueController.populateDengueClusters().then(function () {
                        dengueController.getDengueClusters().then(function (results) {
                            fn(results)
                        })
                    })
                } else {
                    fn(results)
                }
            })
        })

        client.on("getIncidents", function (fn) {
            incidentsController.getIncidents().then(function (results) {
                fn(results)
            })
        })

        // Client sends server new incident data to upload to db, then server tells all clients to pull update 
        client.on("uploadIncident", function (incidentData) {
            incidentsController.uploadIncident(incidentData).then(function () {
                server.emit("getIncidentUpdate", "New incident uploaded, updating incidents")
            })
        })

        // Client sends server a new crisis level to update an incident, then server tells all clients to pull update 
        client.on("updateCrisisLevel", function (updateList) {
            incidentsController.updateIncidentCrisisLevel(updateList).then(function () {
                server.emit("getIncidentUpdate", "Crisis level changed, updating incidents")
            })
        })

        // Client sends server a new crisis level to update an incident, then server tells all clients to pull update 
        client.on("updateIncidentStatus", function (updateList) {
            incidentsController.updateIncidentStatus(updateList).then(function () {
                server.emit("getIncidentUpdate", "Incidents resolved, updating incidents")
            })
        })

        // For social media
        client.on("sendTwitterInfo", function (tweet) {
            console.log("Posted Tweet!", tweet)
            socialMediaController.postTwitterInfo(tweet)
        })

        client.on("sendFbInfo", function (fb_info) {
            console.log("Posted fb_info!", fb_info)
            socialMediaController.postFbInfo(fb_info)
        })

        client.on("sendSmsInfo", function (sms_info) {
            console.log("Posted sms_info!", sms_info)
            socialMediaController.postSmsInfo(sms_info)
        })

        client.on("updateActionsTaken", function (resources_selected) {
            incidentsController.updateIncidentActionsTaken(resources_selected).then(function () {
                server.emit("getIncidentUpdate", "Incident actions taken updated, updating incidents")
            })
        })

        // Manually generate ongoing and resolved reports and send to the email input
        client.on("generateReport", async function (email) {
            psiArr = []
            incidentsArr = []
            dengueArr = []

            // Pull psi data
            psi = await psiController.getPSI()
            // Pull dengue data
            dengue = await dengueController.getDengueClusters()

            //Pull incidents data and generate report
            ongoingincidents = await incidentsController.getReportIncidents("ONGOING")

            reportController.generateReport("ONGOING", psi, ongoingincidents, dengue)

            resolvedincidents = await incidentsController.getReportIncidents("RESOLVED")


            reportController.generateReport("RESOLVED", psi, resolvedincidents, dengue).then(function () {
                socialMediaController.postEmailInfo("Manually", email)
            })

        })

        /*** Admin Manage Resources ***/

        // On client connection, pull update
        client.emit("getResourcesUpdate", "Pulling resources data")

        client.on("getResources", function (fn) {
            resourcesController.getResources().then(function (results) {
                fn(results)
            })
        })

        client.on("addResource", function (newResource) {
            resourcesController.addResource(newResource).then(function () {
                server.emit("getResourcesUpdate", "Resource added, updating resources")
            })
        })

        client.on("deleteResource", function (resource_id) {
            resourcesController.deleteResource(resource_id).then(function () {
                server.emit("getResourcesUpdate", "Resource deleted, updating resources")
            })
        })

        client.on("updateResource", function (updateList) {
            resourcesController.updateResource(updateList).then(function () {
                server.emit("getResourcesUpdate", "Resources updated, updating resources")
            })
        })

        /*** Admin Manage Users ***/

        // On client connection, pull update
        client.emit("getUsersUpdate", "Requesting initial data")

        client.on("getUsers", function (fn) {
            usersController.getUsers().then(function (results) {
                fn(results)
            })
        })

        client.on("updateUser", function (newUser) {
            usersController.updateUser(newUser).then(function () {
                server.emit("getUsersUpdate", "User updated, updating users")
            })
        })

        client.on("deleteUser", function (user_id) {
            usersController.deleteUser(user_id).then(function () {
                server.emit("getUsersUpdate", "User deleted, updating users")
            })
        })




    })
}