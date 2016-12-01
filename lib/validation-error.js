'use strict';
const util = require('util');
const map = require('lodash/map');
const flatten = require('lodash/flatten');

function ValidationError (errors, options) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.errors = errors;
  this.flatten = options.flatten;
  this.status = options.status;
  this.statusText = options.statusText;
};
util.inherits(ValidationError, Error);

ValidationError.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

ValidationError.prototype.toJSON = function toJSON () {
  return {
    status: this.status,
    statusText: this.statusText,
    errors: this.flatten ? flatten(map(this.errors, 'messages')) : this.errors
  };
};

module.exports = ValidationError;
