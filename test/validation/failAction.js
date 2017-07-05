'use strict';

var Joi = require('joi');

module.exports = {
  query: {
    param: Joi.number().integer().required(),
  },
  failAction: function (req, res, source, errors) {
    res.status(400).json({ failAction: true });
  }
};
