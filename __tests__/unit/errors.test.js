const ValidationError = require('../../lib/validation-error');

describe('Validation Errors', () => {
  describe('when creating a validation error', () => {
    it('should return error correctly populated', async () => {
      const errors = {
        body: [
          {
            message: '"password" is not allowed to be empty',
            path: [
              'password',
            ],
            type: 'string.empty',
            context: {
              label: 'password',
              value: '',
              key: 'password',
            },
          },
        ],
      };

      const expected = {
        name: 'ValidationError',
        message: 'Validation Failed',
        statusCode: 400,
        error: 'Invalid Request',
        details: {
          body: [
            {
              message: '"password" is not allowed to be empty',
              path: [
                'password',
              ],
              type: 'string.empty',
              context: {
                label: 'password',
                value: '',
                key: 'password',
              },
            },
          ],
        },
      };

      const options = { error: 'Invalid Request', statusCode: 400 };
      const error = new ValidationError(errors, options);
      expect(error).toEqual(expected);
    });
  });
});
