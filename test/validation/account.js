'use strict';

var Joi = require('@hapi/joi');

module.exports = {
  params: {
    id : Joi.number().integer().required()
  }
};
