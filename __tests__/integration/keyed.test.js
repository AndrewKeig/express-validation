const Joi = require('joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
};

const app = createServer('get', '/account/:id', schema, { keyByField: true }, {}, 'params');

describe('Keyed response', () => {
  describe('when ev options requests the ', () => {
    it('should return a flat response', async () => {
      const response = await request(app).get('/account/a');
      expect(response.statusCode).toBe(400);
      expect(response.body.details.length).toBe(1);
      expect(response.body.details[0].id).toBe('"id" must be a number');
    });
  });
});
