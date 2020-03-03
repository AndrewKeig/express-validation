const http = require('http');
const Joi = require('@hapi/joi');

const evOptions = {
  context: null,
  statusCode: 400,
  statusText: http.STATUS_CODES[400],
};

const evSchema = Joi.object({
  context: Joi.boolean(),
  status: Joi.number().custom((statusCode) => {
    if (!http.STATUS_CODES[statusCode]) {
      throw new Error(`Error: Http status code ${statusCode} not supported`);
    }

    return statusCode;
  }),
});

const mergeEvOptions = (options) => {
  const statusCode = options.statusCode || evOptions.statusCode;
  return { ...evOptions, options, statusText: http.STATUS_CODES[statusCode] };
};

exports.mergeEvOptions = mergeEvOptions;
exports.evSchema = evSchema;
