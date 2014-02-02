var Joi = require('joi');

module.exports = {
  headers: {
    accesstoken: Joi.string().required(),
    userid : Joi.string().required()
  }
};