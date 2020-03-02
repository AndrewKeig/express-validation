const Joi = require('@hapi/joi');

module.exports = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
};
