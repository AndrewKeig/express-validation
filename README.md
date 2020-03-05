express-validation
==================

[![Build Status](https://travis-ci.org/AndrewKeig/express-validation.svg?branch=master)](https://travis-ci.org/AndrewKeig/express-validation)
[![npm module](https://badge.fury.io/js/express-validation.svg)](https://www.npmjs.org/package/express-validation)
[![dependencies](https://david-dm.org/andrewkeig/express-validation.svg)](https://david-dm.org/andrewkeig/express-validation)
[![Current Version](https://flat.badgen.net/npm/v/express-validation?icon=npm)](https://www.npmjs.org/package/express-validation)
[![airbnb-style](https://flat.badgen.net/badge/eslint/airbnb/ff5a5f?icon=airbnb)](https://github.com/airbnb/javascript)
![Coveralls github](https://img.shields.io/coveralls/github/andrewkeig/express-validation)


`express-validation` is an express middleware that validates a request and returns a response with errors; if any of the configured validation rules fail.

We use [joi](https://github.com/hapijs/joi/tree/master) to define validation rules, we have a hard dependency on Joi in order to avoid compatability issues with Joi releases.

## Parameter types
We support validating the following parameter types:

- headers
- params (path)
- query
- cookies
- signedCookies
- body

## Install

Install with npm:

```sh
npm i express-validation --save
```

Install with yarn:

```sh
yarn add express-validation
```

## Example

In order to setup and use `express-validation` consider the following simple express application. It has a single route; configured to use the `express-validation` middleware function `validate`; it accepts as input `loginValidation`; which defines validation rules for this route.


```js
const express = require('express')
const Joi = require('@hapi/joi')
const bodyParser = require('body-parser')
const { validate, ValidationError } = require('express-validation')

const loginValidation = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
}

app.use(bodyParser.json())

app.post('/login', validate(loginValidation, options, joiOptions), () => (req, res) {
    res.json(200)
})

app.use(function(err, req, res, next) {
  if (err instanceof ValidationError) {
    return res.status(err.statusCode).json(err)
  }

  return res.status(500).json(err)
})

app.listen(3000)
```
We have defined two rules `email` and `password`.  They are encapsulated inside `body`; which is important; as this defines their location within the request.

We also need to setup an express global error handler, `express-validation` will pass errors to this handler.  We can check within the handler for errors of type `validationError` distinguishing validation errors from other types of error.


## Errors

`express-validation`, by `default` will return errors in the following format, an object `details` keyed by `parameter`, each containing an array of errors in `joi` format.

```json
{
      "name": "ValidationError",
      "message": "Validation Failed",
      "statusCode": 400,
      "error": "Bad Request",
      "details": {
        "body": [
          {
            "message": "\"password\" is not allowed to be empty",
            "path": [
              "password"
            ],
            "type": "string.empty",
            "context": {
              "label": "password",
              "value": "",
              "key": "password"
            }
          }
        ]
      }
    }
```

We support other simpler formats via configuration

- `keyByField`, flattens the error details object to a list of messages, keyed by field name

```json
{
  "name": "ValidationError",
  "message": "Validation Failed",
  "statusCode": 400,
  "error": "Bad Request",
  "details": [
    { "accesstoken": "\"accesstoken\" is not allowed to be empty" },
    { "password": "\"password\" is not allowed to be empty" }
  ]
}
```

## API

`express-validation` exposes the following api:

### `validate(schema, [options], [joiOptions]) => [validationError]`

The exported `validate` function takes a `schema` object and two optional arguments,
`options` and `joiOptions` and
returns a `validationError` instance if schema contains errors.

### `schema` (Object)

Default: `{}`

Includes validition rules, defined using `joi`, the rules are keyed by the following `parameter` types:
  - body
  - params (path)
  - query
  - headers
  - cookies
  - signedCookies


### `options` (Object)

Default: `{ context: false, statusCode: 400, keyByField: false }`

Options, used by `express-validation`:
  - `context`, grants Joi access to the request object. This allows you to reference other parts of the request in your validations, see [Joi.ref](https://hapi.dev/family/joi/api/?v=17.1.0#refkey-options) 
    - default { context: false } 
  - `statusCode`, defaults to `400`, this will also set the error message via nodes [status codes](https://nodejs.org/api/http.html#http_http_status_codes)
    - default { statusCode: 400 }
  - `keyByField`, flattens the error details object to a list of messages, keyed by field name


### `joiOptions` (Object)

Default: `{}`

Options, used by `joi`, see [Joi options](https://hapi.dev/family/joi/api/?v=17.1.0#anyvalidateasyncvalue-options), note:

## Examples

For more information on how to use `express-validation` please see the following examples:

#### abortEarly
[`test/abortEarly.test.js`](`test/abortEarly.test.js`)

You can return multiple errors, not just the first encountered, by setting, the joi option `abortEarly: false`

#### context
[`test/context.test.js`](`test/context.test.js`)

Enabling the `context` in `options`, allows you to reference other parts of the request in your validation.

#### defaults
[`test/default.test.js`](`test/default.test.js`)

You can specify `joi` `default` values in your schema.

## License

This work is licensed under the MIT License (see the LICENSE file).

https://github.com/AndrewKeig/express-validation/blob/master/LICENSE
