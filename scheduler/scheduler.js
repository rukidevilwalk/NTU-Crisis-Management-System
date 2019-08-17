/* Author(s): Chiam Jack How */
const weatherController = require('../controllers/weather-controller')
const psiController = require('../controllers/psi-controller')
const dengueController = require('../controllers/dengue-controller')
const socialMediaController = require('../controllers/socialmedia-controller')
const incidentsController = require('../controllers/incidents-controller')
const reportController = require('../controllers/report-controller')

module.exports = function (CronJob, io) {

    // Code that automatically pulls new data from the api every 5mins
    // After the db is updated with the new data, server emits to all connected clients
    // to do a pull update to get the updated data from the db
    let apiupdate = new CronJob('0 */5 * * * *', function () {
        psiController.populatePSI()
        dengueController.populateDengueClusters()
        weatherController.populate24hrWeather()
        weatherController.populate2hrWeather()
        io.emit('getAPIUpdates', 'Pulling API updates')
    })


// Sends an email to the PMO every 30 minutes
// Controllers will first pull the latest report data from the db and
// send the data as well as the PMO's email to the socialmediacontroller
// where an excel file will be generated with the report data
// and the excel file will be attached to the email and be sent to the
// PMO's email
    let sendPMEmail = new CronJob('0 */30 * * * *', async function () {
      psiArr = [];
            incidentsArr = [];
            dengueArr = [];

            // Pull psi data
            psi = await psiController.getPSI()
            // Pull dengue data
            dengue = await dengueController.getDengueClusters()

            //Pull incidents data and generate report
            ongoingincidents = await incidentsController.getReportIncidents("ONGOING")

            reportController.generateReport("ONGOING", psi, ongoingincidents, dengue)

            resolvedincidents = await incidentsController.getReportIncidents("RESOLVED")

            reportController.generateReport("RESOLVED", psi, resolvedincidents, dengue).then(function(){
                            socialMediaController.postEmailInfo("Auto",'cms404PM@gmail.com')
            })
    

    })

    apiupdate.start()

    sendPMEmail.start()

};