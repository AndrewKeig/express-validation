const Joi = require('@hapi/joi');
const { evSchema } = require('../../lib/ev.js');
const { joiSchema } = require('../../lib/joi.js');

describe('Schema', () => {
  describe('Ev Schema', () => {
    describe('when ev schema is valid empty schema ', () => {
      it('should return valid schema', async () => {
        const options = {};

        expect(() => {
          Joi.assert(options, evSchema);
        }).not.toThrow();
      });
    });

    describe('when ev schema is valid ', () => {
      it('should return valid schema', async () => {
        const options = {
          context: true,
          keyByField: true,
          statusCode: 422,
        };

        expect(() => {
          Joi.assert(options, evSchema);
        }).not.toThrow();
      });
    });

    describe('when ev schema has invalid property', () => {
      it('should return invalid schema', async () => {
        const options = {
          invalid: true,
        };

        expect(() => {
          Joi.assert(options, evSchema);
        }).toThrow(/invalid/);
      });
    });

    describe('when ev schema has invalid type', () => {
      it('should return invalid schema', async () => {
        const options = {
          context: 1,
        };

        expect(() => {
          Joi.assert(options, evSchema);
        }).toThrow(/context/);
      });
    });

    describe('when ev schema has invalid status code', () => {
      it('should return invalid schema', async () => {
        const options = {
          statusCode: 1,
        };

        expect(() => {
          Joi.assert(options, evSchema);
        }).toThrow(/statusCode/);
      });
    });
  });

  describe('Joi Schema', () => {
    describe('when joi schema has a single key', () => {
      it('should return valid schema', async () => {
        const options = { body: {} };

        expect(() => {
          Joi.assert(options, joiSchema);
        }).not.toThrow();
      });
    });

    describe('when joi schema has all keys', () => {
      it('should return valid schema', async () => {
        const options = {
          headers: {},
          params: {},
          query: {},
          cookies: {},
          signedCookies: {},
          body: {},
        }

        expect(() => {
          Joi.assert(options, joiSchema);
        }).not.toThrow();
      });
    });

    describe('when joi schema empty schema ', () => {
      it('should have at least one key', async () => {
        const options = {};

        expect(() => {
          Joi.assert(options, joiSchema);
        }).toThrow(/value/);
      });
    });

    describe('when joi schema has invalid property', () => {
      it('should return true', async () => {
        const options = { footer: {} };

        expect(() => {
          Joi.assert(options, joiSchema);
        }).toThrow(/footer/);
      });
    });

    describe('when joi schema has invalid type', () => {
      it('should return invalid schema', async () => {
        const options = {
          body: null,
        };

        expect(() => {
          Joi.assert(options, joiSchema);
        }).toThrow(/body/);
      });
    });
  });
});
