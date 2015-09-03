'use strict';

var Joi = require('joi');
var _ = require('lodash');
var util = require('util');

var ValidationError = function (errors, options) {
  this.message = 'validation error';
  Error.call(this);
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
  var response = {
    status : this.status,
    statusText : this.statusText,
    errors : this.errors
  };

  if (this.flatten){
    response = _.flatten(_.pluck(this.errors, 'messages'));
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
    throw new Error("Please provide a validation schema");
  }

  return function (req, res, next)  {

    var validate = function(current, request, schema, location, allowUnknown){

      if (!request || !schema) {
        return;
      }
      
      Joi.validate(request, schema, {context: request, allowUnknown : allowUnknown, abortEarly : false}, function(errors, value){
        if (!errors || errors.details.length === 0) {
          _.extend(request, value);
          return;
        }
        _.each(errors.details, function(error){
          var errorExists = _.find(current, function(item){
            if (item && item.field === error.path && item.location === location) {
              item.messages.push(error.message);
              item.types.push(error.type);
              return item;
            }
            return;
          });

          if (!errorExists) {
            current.push({ field : error.path, location : location, messages : [error.message], types:[error.type]});
          }

        }, errors);
      });
    };

    var errors = [];

    var pushErrors = function(errors, error){
      if (error) {
        errors.push(error);
      }
    };

    // Set default options
    var options = schema.options ? _.defaults({}, schema.options, globalOptions, defaultOptions) : _.defaults({}, globalOptions, defaultOptions);

    pushErrors(errors, validate(errors, req.headers, schema.headers, 'headers', options.allowUnknownHeaders));
    pushErrors(errors, validate(errors, req.body, schema.body, 'body', options.allowUnknownBody));
    pushErrors(errors, validate(errors, req.query, schema.query, 'query', options.allowUnknownQuery));
    pushErrors(errors, validate(errors, _.extend({}, req.params), schema.params, 'params', options.allowUnknownParams));
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

  globalOptions = _.extend({}, globalOptions, opts);
};
