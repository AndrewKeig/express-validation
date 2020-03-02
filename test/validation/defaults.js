const Joi = require('@hapi/joi');

const generateUsername = context => {
  if (context && context.firstname && context.lastname) {
    return `${context.firstname.toLowerCase()}-${context.lastname.toLowerCase()}`;
  }
};

generateUsername.description = 'generated username';

module.exports = {
  body: Joi.object({
    username: Joi.string().default(generateUsername),
    firstname: Joi.string().default('Andrew'),
    lastname: Joi.string().default('Keig'),
    created: Joi.date().default(Date.now),
    registered: Joi.boolean().default(true),
    values: Joi.array().default(['1']),
  }),
};
