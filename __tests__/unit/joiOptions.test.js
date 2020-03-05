const { mergeJoiOptions } = require('../../lib/joi');

describe('Joi Options', () => {
  describe('when merging empty options', () => {
    it('should return default joi options', async () => {
      const joi = {};
      const expected = { warnings: true, context: null };
      const context = false;
      const request = {};
      const result = mergeJoiOptions(joi, context, request);

      expect(result).toEqual(expected);
    });
  });

  describe('when context option is true', () => {
    it('should return joi options with a request context', async () => {
      const joi = {};
      const expected = { warnings: true, context: { body: {} } };
      const context = true;
      const request = { body: {} };
      const result = mergeJoiOptions(joi, context, request);

      expect(result).toEqual(expected);
    });
  });

  describe('when joi options contain properties', () => {
    it('should return joi options with new properties', async () => {
      const joi = { abortEarly: false };
      const expected = { warnings: true, context: null, abortEarly: false };
      const context = false;
      const request = { body: {} };
      const result = mergeJoiOptions(joi, context, request);

      expect(result).toEqual(expected);
    });
  });
});
