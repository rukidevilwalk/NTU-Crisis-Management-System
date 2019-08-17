/* Author(s): Chiam Jack How */
const config = require("./config/config.json")
const express = require("express")
const bodyParser = require("body-parser")
const mongoose = require("mongoose")
const logger = require("morgan")
const CronJob = require("cron").CronJob
const errorHandler = require("errorhandler")
const cookieParser = require("cookie-parser")
const flash = require("express-flash")
const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const app = express()

app.use(express.static("public"))
app.use(bodyParser.urlencoded({
    extended: false
}))
app.use(bodyParser.json())
app.set("view engine", "ejs")
app.use(cookieParser())
app.use(require("express-session")({
    secret: config.secret,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Mongoose

// Change db connection to test database
//config.connectionString = "mongodb://localhost/dbtest"

// Executes script to inject dummy data into test database on server initiliazation
//const mongoose_seed = require('./test/dbtestscript')

mongoose.connect(config.connectionString, {
    useNewUrlParser: true
})

mongoose.Promise = global.Promise
mongoose.set("useFindAndModify", false)
//mongoose.set("debug", true);

//Models for database
require("./models/PSI")
require("./models/dengueClusters")
require("./models/24hrWeather")
require("./models/2hrWeather")
require("./models/incidents")
require("./models/incident_reporter")
require("./models/incident_details")
require("./models/resources")


//Passport for user authentication
var User = require("./models/user")
passport.use(new LocalStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())


//  Socket.io
const http = require("http").Server(app)
const io = require("socket.io")(http)
require("./websocket/server")(io)

//Scheduler
require("./scheduler/scheduler")(CronJob, io)

//Routes
const loginRoutes = require("./routes/login")
const callCenterRoutes = require("./routes/call_center")
const adminRoutes = require("./routes/admin")
app.use(loginRoutes)
app.use(callCenterRoutes)
app.use(adminRoutes)

// Error handler
app.use(errorHandler())

http.listen(config.port, function () {
    console.log("listening on port: " + config.port)
})
