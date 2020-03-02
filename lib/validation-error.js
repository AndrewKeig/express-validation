function ExpressValidationError(errors, options) {
  // console.log(errors)
  this.name = 'ExpressValidationError';
  this.message = 'Express validation error';
  this.errors = errors;
  this.status = options.status;
  this.statusText = options.statusText;
  Error.captureStackTrace(this, ExpressValidationError);
}

ExpressValidationError.prototype = Object.create(Error.prototype);

ExpressValidationError.prototype.toString = function toString() {
  return JSON.stringify(this.toJSON());
};

ExpressValidationError.prototype.toJSON = function toJSON() {
  return {
    status: this.status,
    statusText: this.statusText,
    errors: this.errors,
  };
};

module.exports = ExpressValidationError;
