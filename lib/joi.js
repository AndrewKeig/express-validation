const Joi = require('@hapi/joi');
const { parameters } = require('./parameters');

const schema = parameters
  .reduce((result, item) => ({ ...result, [item]: Joi.object() }), {});

const joiSchema = Joi.object(schema).required().min(1);

const mergeJoiOptions = (joi, ctx = null, request) => {
  const context = ctx ? request : null;
  return { ...joi, warnings: true, context };
};

exports.joiSchema = joiSchema;
exports.mergeJoiOptions = mergeJoiOptions;
