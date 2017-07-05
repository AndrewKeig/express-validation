'use strict';

var validation = require('../lib/index'),
  app = require('./app'),
  should = require('should'),
  request = require('supertest');

describe('failAction', function () {

  describe('when validation fails and failAction is present, failAction is called', function () {
    it('should execute the failAction', function (done) {

      request(app)
        .get('/failAction')
        .expect(400)
        .end(function (err, res) {
          res.body.failAction.should.equal(true);
          done();
        });
    });
  });

  describe('when validation succeeds and failAction is present, failAction not called', function () {
    it('should return a 200 ok response', function (done) {

      request(app)
        .get('/failAction?param=1')
        .expect(200)
        .end(done);
    });
  });
});
