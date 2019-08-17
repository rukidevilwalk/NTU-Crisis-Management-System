/* Author(s): Chiam Jack How */
const express = require("express")
const router = express.Router()

//Check if user is logged in else redirect to login page
function userAuth(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect("/login")
    }
}

router.get("/logout", function (req, res) {
    req.logout()
    res.redirect("/")
})

router.get("/dashboard", userAuth,function (req, res) {

    res.render("dashboard/dashboard", {
        page: "Dashboard",
        user: req.user
      })

})

module.exports = router
