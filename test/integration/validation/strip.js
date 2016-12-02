var Joi = require('joi');

module.exports = {
  body: {
    stripMe: Joi.any().strip()
  }
};
