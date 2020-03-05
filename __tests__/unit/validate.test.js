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
      expect(() => {
        const middleware = validate(schema, {}, {});
        middleware(null, {}, () => { });
      }).toThrow(/Cannot read property 'headers' of null/);
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
