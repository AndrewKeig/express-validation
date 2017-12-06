'use strict';
var map = require('lodash/map');
var flatten = require('lodash/flatten');
var util = require('util');

function ValidationError (errors, options) {
  Error.captureStackTrace(this, this.constructor);
  this.message = 'validation error';
  this.errors = errors;
  this.flatten = options.flatten;
  this.status = options.status;
  this.statusText = options.statusText;
};
util.inherits(ValidationError, Error);

ValidationError.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

ValidationError.prototype.toJSON = function () {
  if (this.flatten) return flatten(map(this.errors, 'messages'));
  return {
    status: this.status,
    statusText: this.statusText,
    errors: this.errors
  };
};

module.exports = ValidationError;
