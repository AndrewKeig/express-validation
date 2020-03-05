
## Changelog

### Changes from versions 2.0

- Global options for `allowUnknown*` removed
- Joi no longer parsing response to JSON, so we dont



### Changes before 3.0

2.0.0:
- Updated to joi version 15, which broke all the things:
  [#101](https://github.com/AndrewKeig/express-validation/pull/101)

1.0.2:
 - Lifted Joi peerDependencies, now it's `*` so to offload responsability to end-users. [#58](https://github.com/AndrewKeig/express-validation/issues/58)

1.0.0:
 - Removed `flatten` documentation as the functionality was broken since 0.5.0 and nobody opened an issue about it (nor there were tests for that option).
 - Added `contextRequest` option from [#25](https://github.com/AndrewKeig/express-validation/pull/25), thanks to [@amazzeo](https://github.com/amazzeo)
 - A bit of documentation revamp, feedback is welcome

0.6.0: `Joi` dependency moved to `peerDependencies`, it has to be installed at the same depth as `express-validation`. This is to avoid having to bump library version to update `Joi`.

0.5.0: `req` objects gets parsed. `Joi` validates the `body`, `params`, `query`, `headers` or `cookies` and returns a Javascript Object.

0.4.5: support for `Joi.ref` inside arrays, refer to #17 for an example

0.4.4: support for Joi [`any.default`](https://github.com/hapijs/joi#anydefaultvalue-description), thanks to [@iheanyi](https://github.com/iheanyi)

0.4.3: added cookies validation, thanks to [@aymericbeaumet](https://github.com/aymericbeaumet).

0.4.2: errors have now a `types` array ([full reference in Joi source](https://github.com/hapijs/joi/blob/master/lib/language.js)), similar to `messages`, useful to sum up errors for internationalization purposes.

0.4.1: added `options()` method to [globally override configuration](#global-options).

0.4.0: `express-validation` now returns a `ValidationError`, not a simple `Error`. This offer some advantages [when writing error handlers](#distinguish-errors-from-validationerrors).

0.3.0: prior to version 0.3.0, we returned a json error response straight out of the middleware, this changed in 0.3.0 to allow the express application itself to return the error response.  So from 0.3.0 onwards, you will need to add an express error handler, and return an error response.



