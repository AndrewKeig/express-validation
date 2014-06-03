express-validation
==================

express-validation is a middleware that validates the body, params, query, headers of a request and returns a 400 Bad request response; with errors; if any of the configured validation rules fail.

#install

```
npm install express-validation --save
```


#supporting

express-validation supports validating the followig: 

- body
- params
- query
- headers

#setup
In order to setup and use express-validation consider the following simple express application.  It has a single route; configured to use the ```express-validation``` middleware; it accepts as input ```validation.login```; which are the validation rules we have defined for this route.

```
var express = require('express')
  , validate = require('express-validation')
  , http = require('http') 
  , validation = require('./validation')
  , app = express();

app.use(express.bodyParser());
app.set('port', 3000);

app.post('/login', validate(validation.login), function(req, res){
    res.json(200);
});

http.createServer(app);
```


The following segment defines our validation rules ```validation.login```.  Its simply an object, which uses [https://github.com/spumko/joi](https://github.com/spumko/joi) to define validation rules for a request.

We have defined two rules ```email``` and ```password```.  They are encapsulated inside ```body```; which is important; as this defines their location, alternatives being, ```params```, ```query```, ```headers```.

```
var Joi = require('joi');

module.exports = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
```

The following test, calls the route defined in our express application ```/login```; it passes in a payload with an ```email``` and empty ```password```.  

```
describe('when the request has a missing item in payload', function () {
  it('should return a 400 ok response and a single error', function(done){

    var login = {
        email: "andrew.keig@gmail.com",
        password: ""
    };

    request(app)
      .post('/login')
      .send(login)
      .expect(400)
      .end(function (err, res) {
        var response = JSON.parse(res.text);
        response.errors.length.should.equal(1);
        response.errors[0].messages.length.should.equal(2);
        done();
      });
    });
});
```

Running the above test will produce the following response.

```
{
  "status": 400,
  "statusText": "Bad Request",
  "errors": [
    {
      "field": "password",
      "location": "body",
      "messages": [
        "the value of password is not allowed to be empty",
        "the value of password must match the regular expression /[a-zA-Z0-9]{3,30}/"
      ]
    }
  ]
}
```

If you would prefer to simply return a lis of errors; you can flatten this structure; by passing an options array; with flatten set to true:

```
module.exports.post = {
  options : { flatten : true },
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
```

This will produce the following response; an array of strings.


```
[
  "the value of password is not allowed to be empty",
  "the value of password must match the regular expression /[a-zA-Z0-9]{3,30}/"
]

```

By default, additional items outside of the schema definition will be allowed to pass
validation.  To enforce strict checking, set the `allowUnknown\*` options as follows:

```
module.exports.post = {
  options : { 
    allowUnknownBody: false, 
    allowUnknownHeaders: false,
    allowUnknownQuery: false, 
    allowUnknownParams: false },
  ...
};
```

#issues with headers
When creating a validation object that checks ```req.headers```; please remember to use lowercase names; node.js will convert incoming headers to lowercase:


```
var Joi = require('joi');

module.exports = {
  headers: {
    accesstoken: Joi.string().required(),
    userid : Joi.string().required()
  }
};
```
