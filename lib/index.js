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

  const hasErrors = (errors) => (errors ? new ValidationError(errors, evOptions) : null);

  return async (request, response, next) => {
    try {
      const joiOptions = options.context ? { ...baseJoiOptions, context: request } : baseJoiOptions;

      const promises = parameters
        .filter(parameter => request[parameter] && schema[parameter])
        .map(parameter => validate(request, parameter, joiOptions));

      let e = await Promise.all(promises);
      e = clean(e);
      const r = keyByField(e, options.keyByField);

      next(hasErrors(r));
    } catch (err) {
      // Make sure that we don't cause an unhandled rejection if there's an error in the code:
      next(err);
    }
  };
};

exports.ValidationError = ValidationError;
exports.Joi = Joi;
