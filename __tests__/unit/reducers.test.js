const { keyByField } = require('../../lib/reducers.js');

describe('Reducers', () => {
  describe('when request to reduce errors is null', () => {
    it('should return null', async () => {
      const result = keyByField(null, true);
      expect(result).toEqual(null);
    });
  });

  describe('when request to reduce errors', () => {
    it('should return simplified errors', async () => {
      const error = {
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
      const expected = [
        { password: '"password" is not allowed to be empty' },
      ];

      const result = keyByField(error, true);
      expect(result).toEqual(expected);
    });
  });

  describe('when request to reduce errors with multiple errors', () => {
    it('should return simplified errors', async () => {
      const error = {
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
        params: [
          {
            message: '"token" is not allowed to be empty',
            path: [
              'token',
            ],
            type: 'string.empty',
            context: {
              label: 'token',
              value: '',
              key: 'token',
            },
          },
        ],
      };
      const expected = [
        { password: '"password" is not allowed to be empty' },
        { token: '"token" is not allowed to be empty' },
      ];

      const result = keyByField(error, true);
      expect(result).toEqual(expected);
    });
  });

  describe('when request to not reduce errors', () => {
    it('should return default errors', async () => {
      const error = {
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

      const result = keyByField(error, false);
      expect(result).toEqual(expected);
    });
  });
});
