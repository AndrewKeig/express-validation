'use strict';

var validate = require('../lib/index').validate;
var schema = require('./validation/account');
var should = require('should');

describe('validate API', function () {

  it('should return an object with the validation result', function () {
    var values = validate(schema, { params: { id: '00013' } });
    should(values).deepEqual({ params: { id: 13 } });
  });

  it('throws an error if validation fails', function (done) {
    try {
      validate(schema, { params: { id: 'string' } });
    } catch (err) {
      done();
    }
  });

});
