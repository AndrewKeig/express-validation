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
    try {
      const { value } = await schema[parameter].validateAsync(request[parameter], joiOptions);
      handleMutation(request, parameter, value, evOptions.context);
      return undefined;
    } catch (error) {
      return { [parameter]: error.details };
    }
  }

  return async (request, response, next) => {
    try {
      const joiOptions = options.context ? { ...baseJoiOptions, context: request } : baseJoiOptions;

      const promises = [];
      for (const parameter of parameters) {
        if (request[parameter] && schema[parameter]) {
          promises.push(validate(request, parameter, joiOptions));
        }
      }

      const errors = keyByField(clean(await Promise.all(promises)), options.keyByField);

      if (errors) {
        next(new ValidationError(errors, evOptions));
      } else {
        next();
      }
    } catch (err) {
      // Make sure that we don't cause an unhandled rejection if there's an error in the code:
      next(err);
    }
  };
};

exports.ValidationError = ValidationError;
exports.Joi = Joi;
