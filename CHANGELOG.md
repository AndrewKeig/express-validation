# Change Log
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/) 
and this project adheres to [Semantic Versioning](http://semver.org/).

## [Unreleased]
### TODO
 - Comparison with `express-validator`
 - Introduction to the middleware and how-to use guide
 - Overall documentation revamp before 2.x release

### Added
 - ValidationError now has a name, that is 'ValidationError' [#44][pr-44]
 - name (`validationMiddleware`) on the returning middleware function [#49][issue-49]
 - added back `flatten` functionality

[issue-49]: https://github.com/AndrewKeig/express-validation/issues/49

### Changed
 - express.js request mutation is now handled by Joi itself, except if `mutateRequest` is set to `false`. In this case the request is not mutated **at all** [#48][pr-48] [#46][pr-46]

[pr-48]: https://github.com/AndrewKeig/express-validation/pull/48
[pr-46]: https://github.com/AndrewKeig/express-validation/pull/46
[pr-44]: https://github.com/AndrewKeig/express-validation/pull/44

### Removed
 - `contextRequest` option has been removed, now the full request (or most of it) gets passed as Joi context. [#36][issue-36]
This implies `Joi.ref($body.key)` must **always** contain *body/query/cookies/etc* before specifing a key.

[issue-36]: https://github.com/AndrewKeig/express-validation/issues/36

## [1.0.0] - 2016-06-29
### Removed
 - `flatten` documentation as the functionality was broken since 0.5.0 and nobody opened an issue about it (nor there were tests for that option).

### Changed
 - Added `contextRequest` option from [#25](https://github.com/AndrewKeig/express-validation/pull/25), thanks to [@amazzeo](https://github.com/amazzeo)
 - A bit of documentation revamp, feedback is welcome

## [0.6.0] - 2016-04-10
### Changed
 - `Joi` dependency moved to `peerDependencies`, it has to be installed at the same depth as `express-validation`. This is to avoid having to bump library version to update `Joi`.

## [0.5.0] - 2016-02-21
### Changed
 - `req` objects gets parsed.
 - `Joi` validates the `body`, `params`, `query`, `headers` or `cookies` and returns a Javascript Object.

## [0.4.5] - 2015-09-03
### Changed
 - support for `Joi.ref` inside arrays, refer to #17 for an example

## [0.4.4] - 2015-08-20
### Changed
 - support for Joi [`any.default`](https://github.com/hapijs/joi#anydefaultvalue-description), thanks to [@iheanyi](https://github.com/iheanyi)

## [0.4.3] - 2015-07-10
### Changed
 - added cookies validation, thanks to [@aymericbeaumet](https://github.com/aymericbeaumet).

## [0.4.2] - 2015-06-17
### Added
 - errors have now a `types` array ([full reference in Joi source](https://github.com/hapijs/joi/blob/master/lib/language.js)), similar to `messages`, useful to sum up errors for internationalization purposes.

## [0.4.1] - 2015-04-23
### Added
 - `options()` method to [globally override configuration](#global-options).

## [0.4.0] - 2015-04-23
### Changed
 - `express-validation` now returns a `ValidationError`, not a simple `Error`.
This offer some advantages [when writing error handlers](#distinguish-errors-from-validationerrors).

## [0.3.0] - 2014-10-28
### Changed
 - Prior to version 0.3.0, a json error response would be sent in case of validation error.
 - This changed in 0.3.0 to allow the express application itself to return the error response.  From here onwards, users will need to add an express error handler, and return an error response.
