const Joi = require('@hapi/joi');

const ValidationError = require('./validation-error');
const { mergeJoiOptions, joiSchema } = require('./joi');
const { mergeEvOptions, evSchema } = require('./ev');
const { parameters } = require('./parameters');
const { handleMutation } = require('./mutation');
const { clean, keyByField } = require('./reducers');

exports.validate = (schema = {}, options = {}, joi = {}) => {
  Joi.assert(options, evSchema);
  Joi.assert(schema, joiSchema);

  return (request, response, next) => {
    const evOptions = mergeEvOptions(options);
    const joiOptions = mergeJoiOptions(joi, options.context, request);

    const validate = (parameter) => schema[parameter].validateAsync(request[parameter], joiOptions)
      .then(result => handleMutation(request[parameter], result.value, evOptions.context))
      .catch(error => ({ [parameter]: error.details }));

    const hasErrors = (errors) => (errors ? new ValidationError(errors, evOptions) : null);

    const promises = parameters
      .filter(parameter => request[parameter] && schema[parameter])
      .map(parameter => validate(parameter));

    return Promise.all(promises)
      .then(e => clean(e))
      .then(e => keyByField(e, options.keyByField))
      .then(r => next(hasErrors(r)));
  };
};

exports.ValidationError = ValidationError;
exports.Joi = Joi;
