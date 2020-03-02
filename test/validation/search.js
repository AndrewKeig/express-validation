const Joi = require('@hapi/joi');

module.exports = {
  query: Joi.object({
    q: Joi.string().required(),
  }),
};
