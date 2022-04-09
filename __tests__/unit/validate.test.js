const { validate, Joi } = require('../../lib/index');

const schema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
};

describe('Validate', () => {
  describe('when invalid joi schema', () => {
    it('should throw error', async () => {
      expect(() => {
        validate();
      }).toThrow(/value/);
    });
  });

  describe('when invalid ev schema', () => {
    it('should throw error', async () => {
      expect(() => {
        validate(schema, { invalid: true });
      }).toThrow(/invalid/);
    });
  });

  describe('when invalid req', () => {
    it('should throw error', async () => {
      const next = jest.fn();
      const middleware = validate(schema, {}, {});
      await middleware(null, {}, next);

      expect(next).toHaveBeenCalledTimes(1);
      const error = next.mock.calls[0][0];
      expect(error).toBeInstanceOf(TypeError);
      expect(error.message).toMatch(/Cannot read property 'headers' of null|Cannot read properties of null \(reading 'headers'\)/)
    });
  });

  describe('when schemas and options are valid', () => {
    it('should return nullr', async () => {
      expect(() => {
        const middleware = validate(schema, {}, {});
        middleware({}, {}, (e) => {
          expect(e).toBe(null);
        });
      });
    });
  });
});
