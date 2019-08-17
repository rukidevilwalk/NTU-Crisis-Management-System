/* Author(s): Chiam Jack How */
const express = require('express')
const router = express.Router()
const passport = require('passport')

const User = require('../models/user')

//Check if user is logged in else redirect to login page
function userAuth(req, res, next) {
  if (req.user) {
    next()
  } else {
    res.redirect("/login")
  }
}

router.get("/", userAuth, function (req, res) {
    if (req.user.role !== "admin")
      res.redirect("/dashboard")
      else 
      res.redirect("/admindashboard")

})

router.get('/register', userAuth, function (req, res) {

    res.render('register', {
        page: 'Register'
    })

})

router.get('/login', function (req, res) {

  // If user logged in, redirect to dashboard
  if (req.user)
    res.redirect("/")
  else
    res.render('login', {
      page: 'Login',
      error : req.flash('error')
    })

})

router.post('/login', passport.authenticate("local",
    // If wrong username/password, redirect to login page again
    {
      successRedirect: "/",
      failureRedirect: "/login",
       failureFlash : { type: 'error', message: 'invalid' }
    }),
  function (req, res) {})

router.post('/register', userAuth, function (req, res) {

  var user = new User({
    username: req.body.username,
    role: req.body.role,
    contact_number: req.body.contact,
    email: req.body.email
  })

  // Redirect to dashboard upon successful account creation,else redirect to register page again
  User.register(user, req.body.password, function (err, user) {
    if (err) {
      console.log(err);
      res.render("register", {
        page: 'Register'
      })
    }

    
      res.redirect("/admindashboard");
    

  })

})

module.exports = router;