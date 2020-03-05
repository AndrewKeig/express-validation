function ValidationError(errors, options) {
  this.name = 'ValidationError';
  this.message = 'Validation Failed';
  this.statusCode = options.statusCode;
  this.error = options.error;
  this.details = errors;
}

ValidationError.prototype = Object.create(Error.prototype);

module.exports = ValidationError;
