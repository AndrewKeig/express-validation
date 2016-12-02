'use strict'

// Error subclassing assert suite from:
// https://gist.github.com/justmoon/15511f92e5216fa2624b

const assert = require('assert')
const util = require('util')
const ValidationError = require('../lib/validation-error')

function doSomethingBad () {
  throw new ValidationError(['It went bad!'])
}

describe('Check that ValidationError is correctly subclassed', () => {
  it('should pass the assert testing defined by the common internet knowledge', () => {
    try {
      doSomethingBad()
    } catch (err) {
      // The name property should be set to the error's name
      assert(err.name = 'ValidationError')

      // The error should be an instance of its class
      assert(err instanceof ValidationError)

      // The error should be an instance of builtin Error
      assert(err instanceof Error)

      // The error should be recognized by Node.js' util#isError
      assert(util.isError(err))

      // The error should have recorded a stack
      assert(err.stack)

      // toString should return the default error message formatting
      assert.strictEqual(err.toString(), JSON.stringify({ errors: ['It went bad!'] }))

      // The stack should start with the default error message formatting
      assert.strictEqual(err.stack.split('\n')[0], 'ValidationError: validation error')

      // The first stack frame should be the function where the error was thrown.
      assert.strictEqual(err.stack.split('\n')[1].indexOf('doSomethingBad'), 7)
    }
  })
})

