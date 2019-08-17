/* Author(s): Chiam Jack How */
var expect = require('chai').expect
var app = require('../app')
var request = require('supertest')

var authenticatedUser = request.agent(app)
before(function (done) {
  authenticatedUser
    .post('/login')
    .send({
      username: 'jack',
      password: '123456'
    })
    .end(function (err, res) {
      expect(res.statusCode).to.equal(302)
      done()
    })
})

describe('GET /dashboard', function (done) {
    it('should return a 200 response if the user is logged in', function (done) {
      authenticatedUser.get('/dashboard')
        .expect(200, done)
    })
    it('should return a 302 response and redirect to /login if user is not logged in', function (done) {
      request(app).get('/dashboard')
        .expect('Location', '/login')
        .expect(302, done)
    })
  })
