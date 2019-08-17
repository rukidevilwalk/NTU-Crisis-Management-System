/* Author(s): Chiam Jack How and Royston Beh Zhi Yang */
const express = require('express')
const router = express.Router()
const usersController = require("../controllers/users-controller")

//Check if user is logged in else redirect to login page
function userAuth(req, res, next) {
    if (req.user) {
        next()
    } else {
        res.redirect("/login")
    }
}

router.get('/manage_user', userAuth, function (req, res) {

    if (req.user.role !== "admin") {
        res.redirect("/")
    } else {
        res.render('admin/manage_user', {
            page: 'Manage Users',
            user: req.user
        })
    }

})

router.get('/manage_resource', userAuth, function (req, res) {

    if (req.user.role !== "admin") {
        res.redirect("/")
    } else {
        res.render("admin/manage_resource", {
            page: 'Manage Resources',
            user: req.user
        })
    }

})

router.get("/admindashboard", userAuth, function (req, res) {
    if (req.user.role !== "admin") {
        res.redirect("/")
    } else {
        res.render("admin/adminpage", {
            page: "Admin Dashboard",
            user: req.user
        })
    }
})

module.exports = router;