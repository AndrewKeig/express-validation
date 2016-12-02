'use strict';
const Joi = require('joi');
const assignIn = require('lodash/assignIn');
const find = require('lodash/find');
const defaults = require('lodash/defaults');
const ValidationError = require('./validation-error');

const defaultOptions = {
  contextRequest: false,
  allowUnknownHeaders: true,
  allowUnknownBody: true,
  allowUnknownQuery: true,
  allowUnknownParams: true,
  allowUnknownCookies: true,
  status: 400,
  statusText: 'Bad Request'
};
let globalOptions = {};

// maps the corresponding request object to an `express-validation` option
const unknownMap = {
  headers: 'allowUnknownHeaders',
  body: 'allowUnknownBody',
  query: 'allowUnknownQuery',
  params: 'allowUnknownParams',
  cookies: 'allowUnknownCookies'
};

exports = module.exports = function (schema) {
  if (!schema) throw new Error('Please provide a validation schema');

  return function (req, res, next)  {
    const errors = [];

    // Set default options
    const options = defaults({}, schema.options || {}, globalOptions, defaultOptions);

    // NOTE: mutates `errors`
    ['headers', 'body', 'query', 'params', 'cookies'].forEach(function (key) {
      const allowUnknown = options[unknownMap[key]];
      const entireContext = options.contextRequest ? req : null;
      if (schema[key]) validate(errors, req, schema, key, allowUnknown, entireContext);
    });

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
function validate (errObj, request, schema, location, allowUnknown, context) {
  if (!request[location] || !schema[location]) return;

  const joiOptions = {
    context: context || request[location],
    allowUnknown: allowUnknown,
    abortEarly: false
  };

  Joi.validate(request[location], schema[location], joiOptions, function (errors, value) {
    if (!errors || errors.details.length === 0) {
      request[location] = value;
      return;
    }
    errors.details.forEach(function (error) {
      const errorExists = find(errObj, function (item) {
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
