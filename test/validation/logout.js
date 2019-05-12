'use strict';

var Joi = require('@hapi/joi');

module.exports = {
  options: { allowUnknownCookies: false },
  cookies: {
    id: Joi.string().regex(/^[0-9]+$/).required(),
    session: Joi.string().regex(/^[a-zA-Z0-9]{16}$/).required()
  }
};
