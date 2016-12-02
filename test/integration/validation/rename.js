var Joi = require('joi');

module.exports = {
  body: Joi.object().keys().rename('renameMe', 'renamedTo')
};
