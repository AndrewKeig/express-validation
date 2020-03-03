const validation = require('../lib/index');
const schema = require('./validation/login');

const validationHandler = validation(schema);

describe.skip('when library throws an error', function () {

  it('should call next() with a ValidationError', function () {

    var fakeReq = {
      body: {
        email: 'andrew.keiggmail.com',
        password: '12356'
      }
    };

    validationHandler(fakeReq, undefined, function next(err) {
      err.should.be.instanceof(validation.ValidationError);
      err.errors.length.should.equal(1);
      err.status.should.equal(400);
      err.statusText.should.equal('Bad Request');
    });
  });

  it('should be compatible with javascript Error', function () {
    var fakeReq = {
      body: {
        email: 'andrew.keiggmail.com',
        password: '12356'
      }
    };

    validationHandler(fakeReq, undefined, function next(err) {
      err.should.be.instanceof(Error);
      err.errors.length.should.equal(1);
      err.status.should.equal(400);
      err.statusText.should.equal('Bad Request');
    });
  });

  it('should not have a stack trace, since is not a coding error', function () {
    var fakeReq = {
      body: {
        email: 'andrew.keiggmail.com',
        password: '12356'
      }
    };

    validationHandler(fakeReq, undefined, function next(err) {
      err.should.not.have.keys('stack');
      err.errors.length.should.equal(1);
      err.status.should.equal(400);
      err.statusText.should.equal('Bad Request');
    });
  });
});
