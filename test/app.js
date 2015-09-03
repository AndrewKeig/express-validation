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

app.post('/login', validate(validation.login), function(req, res){
    res.json(200);
});

app.get('/user', validate(validation.user.get), function(req, res){
    res.json(200);
});

app.get('/account/:id', validate(validation.account), function(req, res){
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
})

app.post('/defaults', validate(validation.defaults), function(req, res) {  
  res.json(req.body);
})

app.post('/logout', validate(validation.logout), function(req, res){
    res.json(200)
})
app.post('/array', validate(validation.array), function(req, res) {
    res.json(200);
});

app.use(function(err, req, res, next){
  res.status(400).json(err);
});

http.createServer(app);
module.exports = app;
