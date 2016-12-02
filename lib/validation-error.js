'use strict'

const map = require('lodash/map')
const flatten = require('lodash/flatten')

class ValidationError extends Error {
  constructor (errors, options) {
    super('validation error')
    Error.captureStackTrace(this, this.constructor)
    this.name = 'ValidationError'
    this.errors = errors
    this.flatten = options.flatten
    this.status = options.status
    this.statusText = options.statusText
  }

  toString () {
    return JSON.stringify(this.toJSON())
  };

  toJSON () {
    return {
      status: this.status,
      statusText: this.statusText,
      errors: this.flatten ? flatten(map(this.errors, 'messages')) : this.errors
    }
  };
};

module.exports = ValidationError
