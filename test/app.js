const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const { validate, validateJoiSchema } = require('../lib/index');
const validation = require('./validation');

const app = express();
app.use(bodyParser.json());
app.use(cookieParser());

const respondWith = key => {
  return (req, res) => {
    res.status(200).json(req[key]);
  };
};

const response = (req, res) => {
  res.json(200);
};

const options = { abortEarly: true };
const optionsAbort = { abortEarly: false };
const optionsContextRequest = { context: true };

validateJoiSchema([validation.login, validation.user.get]);

app.post('/login', validate(validation.login, {}, options), response);
app.get('/user', validate(validation.user.get, {}, options), response);
app.put('/user/:id', validate(validation.user.put, {}, options), response);
app.get('/account/:id', validate(validation.account, {}, options), respondWith('params'));
app.post('/logout', validate(validation.logout, {}, optionsAbort), response);
app.get('/search', validate(validation.search, {}, options), response);
app.post('/context/:id', validate(validation.context, optionsContextRequest, {}), response);
app.post('/defaults', validate(validation.defaults), respondWith('body'));

// app.post('/options', validate(validation.options), respond200);
// app.get('/parsing/params/:id?', validate(validation.parsing.params), respondWith('params'));
// app.get('/parsing/query', validate(validation.parsing.query), respondWith('query'));
// app.post('/parsing/body', validate(validation.parsing.body), respondWith('body'));
// app.get('/parsing/headers', validate(validation.parsing.headers), respondWith('headers'));
// app.get('/parsing/cookies', validate(validation.parsing.cookies), respondWith('cookies'));

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  res.status(400).json(err);
});

module.exports = app;
