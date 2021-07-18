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
    it('should use the correct errorDetailsFormatter', async () => {
      let formatterCalled = false;
      const errorDetailsFormatter = (errorDetails) => {
        const safeResult = {};
        Object.keys(errorDetails).forEach((key) => {
          const safeErrorDetails = JSON.parse(JSON.stringify(errorDetails[key]));
          delete safeErrorDetails.context.value;
          safeResult[key] = safeErrorDetails;
        });
        formatterCalled = true;
        return safeResult;
      };
      const middleware = validate(schema, { errorDetailsFormatter }, {});
      middleware({ params: { id: 'secret' } }, {}, (e) => {
        expect(e).not.toBe(null);
        expect(formatterCalled).toBe(true);
        expect(JSON.stringify(e)).not.toMatch(/"value":"secret"/);
      });
    });
  });

  describe('when schemas and options are valid', () => {
    it('should return null', async () => {
      expect(() => {
        const middleware = validate(schema, {}, {});
        middleware({}, {}, (e) => {
          expect(e).toBe(null);
        });
      });
    });
  });
});
