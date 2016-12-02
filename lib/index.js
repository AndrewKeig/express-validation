'use strict'
const Joi = require('joi')
const find = require('lodash/find')
const defaults = require('lodash/defaults')
const ValidationError = require('./validation-error')

const defaultOptions = {
  allowUnknownHeaders: true,
  allowUnknownBody: true,
  allowUnknownQuery: true,
  allowUnknownParams: true,
  allowUnknownCookies: true,
  flatten: false,
  mutateRequest: true,
  status: 400,
  statusText: 'Bad Request',
}
let globalOptions = {}

// maps the corresponding request object to an `express-validation` option
const unknownMap = {
  headers: 'allowUnknownHeaders',
  body: 'allowUnknownBody',
  query: 'allowUnknownQuery',
  params: 'allowUnknownParams',
  cookies: 'allowUnknownCookies',
}
const locations = ['body', 'cookies', 'headers', 'params', 'query']

exports = module.exports = function validation (schema) {
  if (!schema) throw new Error('Please provide a validation schema')

  return function validationMiddleware (req, res, next) {
    const errors = []

    // Set default options
    const options = defaults({}, schema.options || {}, globalOptions, defaultOptions)
    const { status, statusText, flatten } = options

    for (let i = 0; i < locations.length; i++) {
      const location = locations[i]

      if (schema[location]) {
        // prepares parameters for validate
        const allowUnknown = options[unknownMap[location]]
        const { mutateRequest } = options
        // extracts only required parts from request
        const { body, cookies, headers, params, query } = req
        const context = { body, cookies, headers, params, query }

        validate(errors, req, schema, location, allowUnknown, context, mutateRequest)
      }
    }

    if (errors.length === 0) return next()
    return next(new ValidationError(errors, status, statusText, flatten))
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

  const joiOptions = { context, allowUnknown, abortEarly: false }

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
        types: [error.type],
      })
    }
  })
};
