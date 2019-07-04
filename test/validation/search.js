'use strict';

var Joi = require('@hapi/joi');

module.exports = {
  query: {
    q: Joi.string().required()
  }
};
