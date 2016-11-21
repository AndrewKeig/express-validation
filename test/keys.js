require('should');
var app = require('./app');
var request = require('supertest');

describe('for schema that remove keys', function () {

  describe('when the schema contains a .strip() predicate', function () {
    it('should remove that key on validation', function (done) {
      request(app)
        .post('/strip')
        .send({ stripMe: 'I should disappear' })
        .expect(200)
        .end(function (err, res) {
          var response = JSON.parse(res.text);
          response.should.not.have.property('stripMe');
          done();
        });
    });
  });

  describe('when the schema contains a .rename() predicate', function () {
    it('should move that key on validation', function (done) {
      request(app)
        .post('/rename')
        .send({ renameMe: 'I should reappear' })
        .expect(200)
        .end(function (err, res) {
          var response = JSON.parse(res.text);
          response.should.not.have.property('renameMe');
          response.should.have.property('renamedTo');
          response.renamedTo.should.be.equal('I should reappear');
          done();
        });
    });
  });
  
  describe('when the schema contains an .empty() predicate', function () {
    it('should remove that key when it is empty', function (done) {
      request(app)
        .post('/empty')
        .send(
        { 
          iAmEmpty: '',
          iAmNotEmpty: 'Text'
        })
        .expect(200)
        .end(function (err, res) {
          var response = JSON.parse(res.text);
          response.should.not.have.property('iAmEmpty');
          response.iAmNotEmpty.should.be.equal('Text');
          done();
        });
    });
  });
});
