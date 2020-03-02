const Joi = require('@hapi/joi');

module.exports = {
  cookies: Joi.object({
    id: Joi.string()
      .regex(/^[0-9]+$/)
      .required(),
    session: Joi.string()
      .regex(/^[a-zA-Z0-9]{16}$/)
      .required(),
  }),
};
