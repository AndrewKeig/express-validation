'use strict';
var Joi = require('joi');
var map = require('lodash/map');
var flatten = require('lodash/flatten');
var assignIn = require('lodash/assignIn');
var each = require('lodash/each');
var find = require('lodash/find');
var defaults = require('lodash/defaults');
var isPlainObject = require('lodash/isPlainObject');

function ValidationError (errors, options) {
  this.message = 'validation error';
  Error.call(this);
  this.errors = errors;
  this.flatten = options.flatten;
  this.status = options.status;
  this.statusText = options.statusText;
};
// ValidationError.prototype = new Error();

ValidationError.prototype.toString = function () {
  return JSON.stringify(this.toJSON());
};

ValidationError.prototype.toJSON = function () {
  var response = {
    status: this.status,
    statusText: this.statusText,
    errors: this.errors
  };

  if (this.flatten) {
    response = flatten(map(this.errors, 'messages'));
  }

  return response;
};

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
  if (!schema) {
    throw new Error('Please provide a validation schema');
  }

  return function (req, res, next)  {

    function validate (current, request, schema, location, allowUnknown) {

      if (!request || !schema) {
        return;
      }
      
      Joi.validate(request, schema, {
        context: request,
        allowUnknown: allowUnknown,
        abortEarly: false
      }, function (errors, value) {
        if (!errors || errors.details.length === 0) {
          assignIn(request, value); // creates bug!
          return;
        }
        each(errors.details, function (error) {
          var errorExists = find(current, function (item) {
            if (item && item.field === error.path && item.location === location) {
              item.messages.push(error.message);
              item.types.push(error.type);
              return item;
            }
            return;
          });

          if (!errorExists) {
            current.push({
              field: error.path,
              location: location,
              messages: [error.message],
              types: [error.type]
            });
          }

        }, errors);
      });
    };

    var errors = [];

    function pushErrors (errors, error) {
      if (error) {
        errors.push(error);
      }
    };

    // Set default options
    var options = schema.options ? defaults({}, schema.options, globalOptions, defaultOptions) : defaults({}, globalOptions, defaultOptions);

    pushErrors(errors, validate(errors, req.headers, schema.headers, 'headers', options.allowUnknownHeaders));
    pushErrors(errors, validate(errors, req.body, schema.body, 'body', options.allowUnknownBody));
    pushErrors(errors, validate(errors, req.query, schema.query, 'query', options.allowUnknownQuery));
    pushErrors(errors, validate(errors, isPlainObject(req.params) ? req.params : {}, schema.params, 'params', options.allowUnknownParams));
    pushErrors(errors, validate(errors, req.cookies, schema.cookies, 'cookies', options.allowUnknownCookies));

    if (errors && errors.length === 0) {
      return next();
    }

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
