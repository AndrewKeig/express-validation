const express = require('express');
const Joi = require('@hapi/joi');
const bodyParser = require('body-parser');
const { validate, ValidationError } = require('../lib/index');

const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const userValidation = {
  params: Joi.object({
    id: Joi.number()
      .required(),
  }),
};

const app = express();
app.use(bodyParser.json());

app.post('/login', validate(loginValidation, {}, {}), (req, res) => {
  res.json(200);
});

app.get('/user/:id', validate(userValidation, {}, {}), (req, res) => {
  res.json(200);
});

app.use((err, req, res, next) => {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err);
  }

  return res.status(500).json(err);
});

app.listen(3000);
