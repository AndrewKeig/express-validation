'use strict';

var Joi = require('joi');

module.exports = {
  body: {
    id: Joi.string().valid(Joi.ref('$params.id')).required()
  }
};
