'use strict';
var Joi = require('joi');
var assignIn = require('lodash/assignIn');
var find = require('lodash/find');
var defaults = require('lodash/defaults');
var isPlainObject = require('lodash/isPlainObject');
var ValidationError = require('./validation-error');

var defaultOptions = {
  flatten: false,
  allowUnknownHeaders: true,
  allowUnknownBody: true,
  allowUnknownQuery: true,
  allowUnknownParams: true,
  allowUnknownCookies: true,
  status: 400,
  statusText: 'Bad Request'
};
var globalOptions = {};

exports = module.exports = function (schema) {
  if (!schema) throw new Error('Please provide a validation schema');

  return function (req, res, next)  {
    var errors = [];

    // Set default options
    var options = defaults({}, schema.options || {}, globalOptions, defaultOptions);

    // NOTE: mutates `errors`
    validate(errors, req.headers, schema.headers, 'headers', options.allowUnknownHeaders);
    validate(errors, req.body, schema.body, 'body', options.allowUnknownBody);
    validate(errors, req.query, schema.query, 'query', options.allowUnknownQuery);
    validate(errors, isPlainObject(req.params) ? req.params : {}, schema.params, 'params', options.allowUnknownParams);
    validate(errors, req.cookies, schema.cookies, 'cookies', options.allowUnknownCookies);

    if (errors && errors.length === 0) return next();

    return next(new ValidationError(errors, options));
  };
};

exports.ValidationError = ValidationError;

exports.options = function (opts) {
  if (!opts) {
    globalOptions = {};
    return;
  }

  globalOptions = defaults({}, globalOptions, opts);
};

/**
 * validate checks the current `Request` for validations
 * NOTE: mutates `request` in case the object is valid.
 */
function validate (errObj, request, schema, location, allowUnknown) {
  if (!request || !schema) return;

  var joiOptions = {
    context: request,
    allowUnknown: allowUnknown,
    abortEarly: false
  };

  Joi.validate(request, schema, joiOptions, function (errors, value) {
    if (!errors || errors.details.length === 0) {
      assignIn(request, value); // joi responses are parsed into JSON
      return;
    }
    errors.details.forEach(function (error) {
      var errorExists = find(errObj, function (item) {
        if (item && item.field === error.path && item.location === location) {
          item.messages.push(error.message);
          item.types.push(error.type);
          return item;
        }
        return;
      });

      if (!errorExists) {
        errObj.push({
          field: error.path,
          location: location,
          messages: [error.message],
          types: [error.type]
        });
      }

    });
  });
};
