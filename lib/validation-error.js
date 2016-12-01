'use strict';
var map = require('lodash/map');
var flatten = require('lodash/flatten');

function ValidationError (errors, options) {
  this.name = 'ValidationError';
  this.message = 'validation error';
  this.errors = errors;
  this.flatten = options.flatten;
  this.status = options.status;
  this.statusText = options.statusText;
};
ValidationError.prototype = Object.create(Error.prototype);

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
