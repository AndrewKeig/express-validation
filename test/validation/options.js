'use strict';

var Joi = require('@hapi/joi');

module.exports = {
  options: {
    status: 422,
    statusText: 'Unprocessable Entity'
  },
  body: {
    option: Joi.string().required()
  }
};
