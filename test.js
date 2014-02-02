var Joi = require('joi');

var schema = {
  userId : Joi.string().required(),
  token : Joi.string().required()
};

var error = Joi.validate({ token : '12345', userId : ''}, schema, {allowUnknown : true, abortEarly : false});

console.log(error);