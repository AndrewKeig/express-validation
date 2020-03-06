/* eslint-disable no-unused-vars */
/* eslint-disable dot-notation */
const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { validate, ValidationError } = require('../lib/index');

exports.createServer = (verb, route, schema, options = {}, joi = {}, key = null, secret = '') => {
  const app = express();
  app.use(bodyParser.json());
  app.use(cookieParser(secret));
  app[verb](route, validate(schema, options, joi), (req, res) => {
    const result = key ? req[key] : {};
    return res.status(200).json(result);
  });
  app.use((err, req, res, next) => res.status(err.statusCode).json(err));
  return app;
};
