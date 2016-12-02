'use strict'
const Joi = require('joi')
const find = require('lodash/find')
const defaults = require('lodash/defaults')
const ValidationError = require('./validation-error')

const defaultOptions = {
  contextRequest: false,
  allowUnknownHeaders: true,
  allowUnknownBody: true,
  allowUnknownQuery: true,
  allowUnknownParams: true,
  allowUnknownCookies: true,
  status: 400,
  statusText: 'Bad Request',
  mutateRequest: true
}
let globalOptions = {}

// maps the corresponding request object to an `express-validation` option
const unknownMap = {
  headers: 'allowUnknownHeaders',
  body: 'allowUnknownBody',
  query: 'allowUnknownQuery',
  params: 'allowUnknownParams',
  cookies: 'allowUnknownCookies'
}

exports = module.exports = function validation (schema) {
  if (!schema) throw new Error('Please provide a validation schema')

  return function (req, res, next) {
    const errors = []

    // Set default options
    const options = defaults({}, schema.options || {}, globalOptions, defaultOptions);

    // NOTE: mutates `errors`
    ['headers', 'body', 'query', 'params', 'cookies'].forEach(function (location) {
      const allowUnknown = options[unknownMap[location]]
      const entireContext = options.contextRequest ? req : null
      const mutateRequest = options.mutateRequest
      if (schema[location]) validate(errors, req, schema, location, allowUnknown, entireContext, mutateRequest)
    })

    if (errors.length === 0) return next()

    return next(new ValidationError(errors, options))
  }
}

exports.ValidationError = ValidationError

exports.options = function (opts) {
  if (!opts) {
    globalOptions = {}
    return
  }

  globalOptions = defaults({}, globalOptions, opts)
}

/**
 * validate checks the current `Request` for validations
 * NOTE: mutates `request` in case the object is valid.
 */
function validate (errObj, request, schema, location, allowUnknown, context, mutateRequest) {
  if (!request || !schema) return

  const joiOptions = {
    context: context || request[location],
    allowUnknown: allowUnknown,
    abortEarly: false
  }

  const { error, value } = Joi.validate(request[location], schema[location], joiOptions)
  if (!error || error.details.length === 0) {
    if (mutateRequest) request[location] = value
    return
  }
  error.details.forEach(function (error) {
    const errorExists = find(errObj, function (item) {
      if (item && item.field === error.path && item.location === location) {
        item.messages.push(error.message)
        item.types.push(error.type)
        return item
      }
      return
    })

    if (!errorExists) {
      errObj.push({
        field: error.path,
        location: location,
        messages: [error.message],
        types: [error.type]
      })
    }
  })
};
