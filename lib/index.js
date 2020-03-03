const Joi = require('@hapi/joi');

const ExpressValidationError = require('./validation-error');
const { mergeJoiOptions, validateJoiSchema, joiSchema } = require('./joi');
const { mergeEvOptions, evSchema } = require('./ev-options');
const { parameters } = require('./parameters');
const { handleMutation } = require('./mutation');

exports.validate = (schema = {}, options = {}, joi = {}) => {
  Joi.assert(schema, joiSchema);
  Joi.assert(options, evSchema);

  return async (request, response, next) => {
    const evOptions = mergeEvOptions(options);
    const joiOptions = mergeJoiOptions(joi, options.context, request);

    const validate = (parameter) => schema[parameter].validateAsync(request[parameter], joiOptions)
      .then(result => handleMutation(request[parameter], result.value))
      .catch(errors => ({ [parameter]: errors.details }));

    const promises = parameters
      .filter(parameter => request[parameter] && schema[parameter])
      .map(parameter => validate(parameter));

    const results = await Promise.all(promises);

    const errors = results
      .filter(item => item)
      .reduce((a, b) => a.concat(b), [])
      .reduce((acc, curr) => ({ ...acc, ...curr }), null);

    if (errors) {
      return next(new ExpressValidationError(errors, evOptions));
    }

    return next();
  };
};

exports.ExpressValidationError = ExpressValidationError;
exports.validateJoiSchema = validateJoiSchema;
