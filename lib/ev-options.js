const http = require('http');
const Joi = require('@hapi/joi');

const evOptions = {
  context: null,
  status: 400,
  statusText: http.STATUS_CODES[400],
};

// validate status..
const evSchema = Joi.object({
  context: Joi.boolean(),
  status: Joi.number(),
});

const mergeEvOptions = (options) => {
  const status = options.status || evOptions.status;
  return { ...evOptions, options, statusText: http.STATUS_CODES[status] };
};

exports.mergeEvOptions = mergeEvOptions;
exports.evSchema = evSchema;
