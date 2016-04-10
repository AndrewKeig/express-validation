express-validation
==================

express-validation is a middleware that validates the `body`, `params`, `query`, `headers` and `cookies` of a request and returns a response with errors; if any of the configured validation rules fail.

[![build status](https://travis-ci.org/AndrewKeig/express-validation.svg)](http://travis-ci.org/AndrewKeig/express-validation)

## Install

```sh
$ npm install express-validation --save
```


## Supporting

`express-validation` supports validating the following:

- body
- params
- query
- headers
- cookies

## Setup
In order to setup and use `express-validation` consider the following simple express application. It has a single route; configured to use the `express-validation` middleware; it accepts as input `validation.login`; which are the validation rules we have defined for this route.

**file**: [`test/app.js`](test/app.js)
```js
var express = require('express')
  , validate = require('express-validation')
  , http = require('http')
  , bodyParser = require('body-parser')
  , cookieParser = require('cookie-parser')
  , app = express();

app.use(bodyParser.json())
app.use(cookieParser())

app.set('port', 3000);

app.post('/login', validate(validation.login), function(req, res){
    res.json(200);
});

// error handler, required as of 0.3.0
app.use(function(err, req, res, next){
  res.status(400).json(err);
});

http.createServer(app);
```


The following section defines our validation rules `validation.login`.  This is simply an object, which uses [https://github.com/spumko/joi](https://github.com/spumko/joi) to define validation rules for a request.

We have defined two rules `email` and `password`.  They are encapsulated inside `body`; which is important; as this defines their location, alternatives being, `params`, `query`, `headers` and `cookies`.

**file**: [`test/validation/login.js`](test/validation/login.js)
```js
var Joi = require('joi');

module.exports = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
```

The following test, calls the route defined in our express application `/login`; it passes in a payload with an `email` and empty `password`.

**file**: [`test/body.js`](test/body.js)
```js
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

```json
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
      ],
      "types": [ "any.empty", "string.regex.base" ]
    }
  ]
}
```

Full code for these examples is to be found in [`test/`](test/) directory.

## `req` objects gets parsed
When `Joi` validates the `body`, `params`, `query`, `headers` or `cookies` it returns it as Javascript Object.

Example without `express-validation`:
```
app.post('/login', function(req, res){
  console.log(req.body); // => '{ "email": "user@domain", "password": "pwd" }'
  res.json(200);
});
```

Example with `express-validation`:
```
var validate = require('express-validation');
var validation = require('./test/validation/login.js');

app.post('/login', validate(validation.login), function(req, res){
  console.log(req.body); // => { email: "user@domain", password: "pwd" }
  res.json(200);
});
```

The difference might seem very slight, but it's a big deal.
All parts of a `request` will be either parsed, or throw errors.

## Distinguish `Error`(s) from `ValidationError`(s)
Since 0.4.0 `express-validation` calls `next()` with a `ValidationError`, a specific type of `Error`.
This can be very handy when writing more complex error handlers for your Express application, a brief example follows:

```js
var ev = require('express-validation');

// error handler
app.use(function (err, req, res, next) {
  // specific for validation errors
  if (err instanceof ev.ValidationError) return res.status(err.status).json(err);

  // other type of errors, it *might* also be a Runtime Error
  // example handling
  if (process.env.NODE_ENV !== 'production') {
    return res.status(500).send(err.stack);
  } else {
    return res.status(500);
  }
});
```

## Options

### Simple error response
If you would prefer to simply return a list of errors; you can flatten this structure; by passing an options array; with `flatten` set to `true`:

```js
module.exports.post = {
  options : { flatten : true },
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};
```

This will produce the following response; an array of strings.


```js
[
  "the value of password is not allowed to be empty",
  "the value of password must match the regular expression /[a-zA-Z0-9]{3,30}/"
]

```

### Unknown schema items

By default, additional items outside of the schema definition will be allowed to pass validation.  To enforce strict checking, set the `allowUnknown\*` options as follows:

```js
module.exports.post = {
  options : {
    allowUnknownBody: false,
    allowUnknownHeaders: false,
    allowUnknownQuery: false,
    allowUnknownParams: false,
    allowUnknownCookies: false },
  ...
};
```

### Specific Status codes and text
By default, the status code is set to `400`, and status text to `Bad Request`, you can change this behaviour with the following:

```js
module.exports.post = {
  options: {
    status: 422,
    statusText: 'Unprocessable Entity'
  },
  ...
};
```

### Global options
Status code and text can also be customized globally. At the same time specific behaviour still applies.

```js
var ev = require('express-validation');
// assign options
ev.options({
  status: 422,
  statusText: 'Unprocessable Entity'
});

// clear options back to default
ev.options();
```
Thanks to node `require()` caching, all the other `express-validation` instances also have the same set of global options.

## Working with headers
When creating a validation object that checks `req.headers`; please remember to use `lowercase` names; node.js will convert incoming headers to lowercase:


```js
var Joi = require('joi');

module.exports = {
  headers: {
    accesstoken: Joi.string().required(),
    userid : Joi.string().required()
  }
};
```

## Changelog

0.6.0: `Joi` dependency moved to `peerDependencies`, it has to be installed at the same depth as `express-validation`. This is to avoid having to bump library version to update `Joi`.

0.5.0: `req` objects gets parsed. `Joi` validates the `body`, `params`, `query`, `headers` or `cookies` and returns a Javascript Object.

0.4.5: support for `Joi.ref` inside arrays, refer to #17 for an example

0.4.4: support for Joi [`any.default`](https://github.com/hapijs/joi#anydefaultvalue-description), thanks to [@iheanyi](https://github.com/iheanyi)

0.4.3: added cookies validation, thanks to [@aymericbeaumet](https://github.com/aymericbeaumet).

0.4.2: errors have now a `types` array ([full reference in Joi source](https://github.com/hapijs/joi/blob/master/lib/language.js)), similar to `messages`, useful to sum up errors for internationalization purposes.

0.4.1: added `options()` method to [globally override configuration](#global-options).

0.4.0: `express-validation` now returns a `ValidationError`, not a simple `Error`. This offer some advantages [when writing error handlers](#distinguish-errors-from-validationerrors).

0.3.0: prior to version 0.3.0, we returned a json error response straight out of the middleware, this changed in 0.3.0 to allow the express application itself to return the error response.  So from 0.3.0 onwards, you will need to add an express error handler, and return an error response.


## License

This work is licensed under the MIT License (see the LICENSE file).

https://github.com/AndrewKeig/express-validation/blob/master/LICENSE

## Contributors
  * Christian Holm https://github.com/holm
  * Iheanyi Ekechukwu https://github.com/iheanyi
  * Aymeric Beaumet https://github.com/aymericbeaumet
  * Valerio Coltrè https://github.com/colthreepv
  * gdw2 https://github.com/gdw2
  * Robert Barbey https://github.com/rbarbey
  * Stefan Lapers https://github.com/slapers
