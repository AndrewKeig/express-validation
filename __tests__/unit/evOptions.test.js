const { mergeEvOptions, defaultErrorDetailsFormatter } = require('../../lib/ev.js');

describe('Ev Options', () => {
  describe('when settings ev options', () => {
    it('should return options correctly populated', async () => {
      const options = {
        context: true,
        keyByField: true,
        statusCode: 422,
      };
      const expected = {
        context: true,
        error: 'Unprocessable Entity',
        keyByField: true,
        statusCode: 422,
        errorDetailsFormatter: defaultErrorDetailsFormatter,
      };
      const result = mergeEvOptions(options);

      expect(result).toEqual(expected);
    });
  });
});
