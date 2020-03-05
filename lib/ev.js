const http = require('http');
const Joi = require('@hapi/joi');

const evOptions = {
  context: false,
  keyByField: false,
  statusCode: 400,
  error: http.STATUS_CODES[400],
};

const evSchema = Joi.object({
  context: Joi.boolean(),
  keyByField: Joi.boolean(),
  statusCode: Joi.number().custom((statusCode) => {
    if (!http.STATUS_CODES[statusCode]) {
      throw new Error(`Error: Http status code ${statusCode} not supported`);
    }

    return statusCode;
  }),
});

const mergeEvOptions = (options) => {
  const statusCode = options.statusCode || evOptions.statusCode;
  return { ...evOptions, ...options, error: http.STATUS_CODES[statusCode] };
};

exports.mergeEvOptions = mergeEvOptions;
exports.evSchema = evSchema;
