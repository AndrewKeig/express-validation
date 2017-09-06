'use strict';
var defaults = require('lodash/defaults');
var includes = require('lodash/includes');
var ValidationError = require('./validation-error');
var validate = require('./validate');

var defaultOptions = {
  rejectUnknown: [],
  status: 400,
  statusText: 'Bad Request'
};

var globalOptions = {};

module.exports = function (schema, userOpts) {
  if (!schema) throw new Error('Please provide a validation schema');

  return function (ctx, next)  {
    var errors = [];

    // Set default options
    var options = defaults({}, userOpts || {}, globalOptions, defaultOptions);

    // NOTE: mutates `errors`
    Object.keys(schema).forEach(function (key) {
      var allowUnknown = !includes(options.rejectUnknown, key);
      if (schema[key]) validate(errors, ctx.request[key], schema[key], key, allowUnknown, ctx);
    });

    if (errors && errors.length === 0) return next();

    ctx.throw(new ValidationError(errors, options));
  };
};

module.exports.ValidationError = ValidationError;

module.exports.options = function (opts) {
  if (!opts) {
    globalOptions = {};
    return;
  }

  globalOptions = defaults({}, globalOptions, opts);
};
