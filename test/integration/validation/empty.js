var Joi = require('joi');

module.exports = {
  body: {
    iAmEmpty: Joi.any().empty(''),
    iAmNotEmpty: Joi.any().empty('')
  }
};