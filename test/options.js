'use strict';

var validation = require('../lib/index')
  , app = require('./app')
  , should = require('should')
  , request = require('supertest');

describe('schema options', function () {

  describe('when schema options does not contain a status options', function () {

    it('should return a 400 ok response and "Bad Request" as message', function (done) {

      var login = {
        email: "andrew.keiggmail.com",
        password: "12356"
      };

      request(app)
        .post('/login')
        .send(login)
        .expect(400)
        .end(function (err, res) {
          var response = JSON.parse(res.text);
          response.errors.length.should.equal(1);
          response.status.should.equal(400);
          response.statusText.should.equal('Bad Request');
          done();
        });
    });
  });

  describe('when schema options contains a 422 status code', function () {

    it('should return a 422 response', function (done) {

      request(app)
        .post('/options')
        .send('')
        .expect(422)
        .end(function (err, res) {
          var response = JSON.parse(res.text);
          response.errors.length.should.equal(1);
          response.status.should.equal(422);
          response.statusText.should.equal('Unprocessable Entity');
          done();
        });
    });
  })
});
