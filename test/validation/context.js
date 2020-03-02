const Joi = require('@hapi/joi');

module.exports = {
  body: Joi.object({
    id: Joi.string()
      .valid(Joi.ref('$params.id'))
      .required(),
  }),
};
