const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  query: Joi.object({
    q: Joi.string().required(),
  }),
};

const app = createServer('get', '/search', schema, {}, { abortEarly: true });

describe('validate query', () => {
  describe('when the request contains a valid query', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app).get('/search?q=true');
      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the request contains an invalid query', () => {
    it('should return a 400 response', async () => {
      const response = await request(app).get('/search?q=');
      expect(response.statusCode).toBe(400);
      expect(response.body.details.query[0].path[0]).toBe('q');
    });
  });
});
