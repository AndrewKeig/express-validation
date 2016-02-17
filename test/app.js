'use strict';

var express = require('express')
  , validate = require('../lib/index')
  , http = require('http')
  , validation = require('./validation')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , app = express()

app.use(bodyParser.json())
app.use(cookieParser())

app.set('port', 3000);

// generates a response function sending back to user the specified req[key]
function respondWith (key) {
  return function (req, res) {
    res.json(req[key]);
  };
}

app.post('/login', validate(validation.login), function(req, res){
    res.json(200);
});

app.get('/user', validate(validation.user.get), function(req, res){
    res.json(200);
});

app.get('/search', validate(validation.search), function(req, res){
    res.json(200);
});

app.put('/user/:id', validate(validation.user.put), function(req, res){
    res.json(200);
});

app.post('/register', validate(validation.register.post), function(req, res){
    res.json(200);
});

app.post('/options', validate(validation.options), function(req, res){
    res.json(200);
});

app.get('/account/:id', validate(validation.account), respondWith('params'));

app.post('/defaults', validate(validation.defaults), respondWith('body'));

app.get('/parsing/params/:id?', validate(validation.parsing.params), respondWith('params'));
app.get('/parsing/query', validate(validation.parsing.query), respondWith('query'));
app.post('/parsing/body', validate(validation.parsing.body), respondWith('body'));
app.get('/parsing/headers', validate(validation.parsing.headers), respondWith('headers'));
app.get('/parsing/cookies', validate(validation.parsing.cookies), respondWith('cookies'));

app.post('/logout', validate(validation.logout), function(req, res){
    res.json(200)
})
app.post('/array', validate(validation.array), function(req, res) {
    res.json(200);
});

app.post('/context/:id', validate(validation.context), function(req, res) {
    res.json(200);
});

app.use(function(err, req, res, next){
  res.status(400).json(err);
});

http.createServer(app);
module.exports = app;
