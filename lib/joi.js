const Joi = require('@hapi/joi');
const { parameters } = require('./parameters');

const schema = parameters
  .reduce((result, item) => ({ ...result, [item]: Joi.any() }), {});

const joiSchema = Joi.object(schema).required().min(1).max(6);

const validateJoiSchema = (schemas) => {
  schemas.forEach(sc => Joi.assert(sc, joiSchema));
};

const mergeJoiOptions = (joi, ctx, request) => {
  const context = ctx ? request : null;
  return { ...joi, warnings: true, context };
};

exports.validateJoiSchema = validateJoiSchema;
exports.joiSchema = joiSchema;
exports.mergeJoiOptions = mergeJoiOptions;
