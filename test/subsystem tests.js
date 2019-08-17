/* Author(s): Chiam Jack How */
const weatherController = require("../controllers/weather-controller")
const psiController = require("../controllers/psi-controller")
const dengueController = require("../controllers/dengue-controller")
const incidentsController = require("../controllers/incidents-controller")
const resourcesController = require("../controllers/resources-controller")
const socialMediaController = require("../controllers/socialmedia-controller")
const usersController = require("../controllers/users-controller")
const reportController = require("../controllers/report-controller")

/*** UNIT TESTS ***/

/* Weather test*/

//Request 2hr weather data from api then updates or insert if doesnt exist into the db
weatherController.populate2hrWeather().then(function () {})

// Partial output of database logs after running the function

//Query the db and retrieve all data from the 2hr weather database collection
weatherController.get2hrWeather().then(function () {})

//Request 24hr weather data from api then updates or insert if doesnt exist into the db
weatherController.populate24hrWeather().then(function () {})

//Query the db and retrieve all data from the 24hr weather database collection
weatherController.get24hrWeather().then(function () {})

/* PSI test*/

//Request PSI data from API then updates or insert if it doesn’t exist, into the database
psiController.populatePSI().then(function () {})

//Query the database and retrieve all data from the PSI database collection
psiController.getPSI().then(function () {})

/* Dengue Clusters test*/

//Request dengue clusters data from API then updates or insert if it doesn’t exist, into the database
dengueController.populateDengueClusters().then(function () {})

//Query the database and retrieve all data from the PSI database collection
dengueController.getDengueClusters().then(function () {})

/* Resources test*/

//Query the database to find all documents in the resources database collection
resourcesController.getResources().then(function () {})

//Query the database to find the resource document based on id input in the resources database collection and update it's attribute values
resourcesController.updateResource().then(function () {})

//Query the database to add a new document to the resources database collection
resourcesController.addResource().then(function () {})

//Query the database to find and delete the resource document based on id input in the resources database collection
resourcesController.deleteResource().then(function () {})

/* Users test*/

//Query the database to find all documents in the user database collection
usersController.getUsers().then(function () {})

//Query the database to find the user document based on id input in the user database collection and update it's attribute values
usersController.updateUser().then(function () {})

//Query the database to find and delete the user document based on id input in the user database collection
usersController.deleteUser().then(function () {})

/* Incidents test*/

//Query the database to find all documents in the incidents database collection
incidentsController.getIncidents().then(function () {})

//Query the database to find the incident document based on id input in the incidents database collection
// and the incident_details id in the incident document is used to locate a correspoding incident_details document
// and update the crisis level value in it
incidentsController.updateIncidentCrisisLevel().then(function () {})

//Query the database to add a new document to the incidents database collection
incidentsController.uploadIncident().then(function () {})

//Query the database to find the incident document based on id input in the incidents database collection
// and the incident_details id in the incident document is used to locate a correspoding incident_details document
// and update the activities field
incidentsController.updateIncidentActionsTaken().then(function () {})

//Query the database to find the incident document based on id input in the incidents database collection
// and the incident_details id in the incident document is used to locate a correspoding incident_details document
// and update the incident status from "ONGOING" to "RESOLVED"
incidentsController.updateIncidentStatus().then(function () {})

//Query the database to find all documents in the incidents database collection
// then depending on the type input of either "ONGOING" or "RESOLVED"
// the incidents data will be filtered to only contain either one of them and return the filtered data
incidentsController.getReportIncidents(type).then(function () {})

/* Report test*/

// Calls the other controllers to return data
// An excel file will be generated and the data that is returned previously
// Will be passed into generateReport and populate the excel file
reportController.generateReport("ONGOING", psi, resolvedincidents, dengue).then(function () {})

/* Social Media test*/

// Server authenticates the twitter account and sends a post request with a message body which is to be posted
socialMediaController.postTwitterInfo(tweet).then(function () {})

// Server authenticates the facebook account and sends a post request with a message body which is to be posted
socialMediaController.postFbInfo(fb_info).then(function () {})

// Server authenticates the twilio account and sends a request with a message body which is to be sent in the sms
socialMediaController.postSmsInfo(sms_info).then(function () {})

// Server creates a Nodemailer transporter using SMTP transport and a gmail account is authenticated with crendentials
// The email header, body and attachment options are created for Nodemailer 
// and the email will be sent out using the transporter
socialMediaController.postEmailInfo("Manually", email)
