// const { ValidationError } = require('@hapi/joi');

function ExpressValidationError(errors, options) {
  Error.captureStackTrace(this, ExpressValidationError); // ??
  this.name = 'ExpressValidationError';
  this.message = 'Express validation error';
  this.errors = errors;
  this.statusCode = options.statusCode;
  this.statusText = options.statusText;
}

ExpressValidationError.prototype = Object.create(Error.prototype);

ExpressValidationError.prototype.toString = function toString() {
  return JSON.stringify(this.toJSON());
};

ExpressValidationError.prototype.toJSON = function toJSON() {
  return {
    statusCode: this.status,
    statusText: this.statusText,
    errors: this.errors,
  };
};

module.exports = ExpressValidationError;


// function ExpressValidationError (a, b, c) {
//   Error.captureStackTrace(this, ExpressValidationError);
//   this.name = `ExpressValidationError [${code}]`;
//   this.code = code;
//   this.message = `${this.code}: ${this.message}`;
//   this.statusCode = statusCode || undefined;
// }

// ExpressValidationError.prototype[Symbol.toStringTag] = 'Error';
// inherits(ExpressValidationError, ValidationError);
