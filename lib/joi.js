const Joi = require('joi');
const { parameters } = require('./parameters');

const schema = parameters
  .reduce((result, item) => ({ ...result, [item]: Joi.object() }), {});

const joiSchema = Joi.object(schema).required().min(1);

exports.joiSchema = joiSchema;
