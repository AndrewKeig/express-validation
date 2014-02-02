var express = require('express')
  , validate = require('../lib/index')
  , http = require('http')
  , validation = require('./validation')
  , app = express();

app.use(express.bodyParser());
app.set('port', 3000);

app.post('/login', validate(validation.login), function(req, res){
    res.json(200);
});

app.get('/user', validate(validation.user), function(req, res){
    res.json(200);
});

app.get('/account/:id', validate(validation.account), function(req, res){
    res.json(200);
});

app.get('/search', validate(validation.search), function(req, res){
    res.json(200);
});

http.createServer(app);
module.exports = app;