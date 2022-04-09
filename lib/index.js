const Joi = require('joi');

const ValidationError = require('./validation-error');
const { joiSchema } = require('./joi');
const { mergeEvOptions, evSchema } = require('./ev');
const { parameters } = require('./parameters');
const { handleMutation } = require('./mutation');
const { clean, keyByField } = require('./reducers');

exports.validate = (schema = {}, options = {}, joi = {}) => {
  Joi.assert(options, evSchema);
  Joi.assert(schema, joiSchema);

  const evOptions = mergeEvOptions(options);
  // We can avoid making a new object for each incoming request when options.context is false:
  const baseJoiOptions = { ...joi, warnings: true };

  async function validate(request, parameter, joiOptions) {
    let result;
    try {
      result = await schema[parameter].validateAsync(request[parameter], joiOptions);
    } catch (error) {
      return { [parameter]: error.details };
    }
    handleMutation(request, parameter, result.value, evOptions.context);
    return undefined;
  }

  return (request, response, next) => {
    const joiOptions = options.context ? { ...baseJoiOptions, context: request } : baseJoiOptions;

    const hasErrors = (errors) => (errors ? new ValidationError(errors, evOptions) : null);

    const promises = parameters
      .filter(parameter => request[parameter] && schema[parameter])
      .map(parameter => validate(request, parameter, joiOptions));

    return Promise.all(promises)
      .then(e => clean(e))
      .then(e => keyByField(e, options.keyByField))
      .then(r => next(hasErrors(r)));
  };
};

exports.ValidationError = ValidationError;
exports.Joi = Joi;
