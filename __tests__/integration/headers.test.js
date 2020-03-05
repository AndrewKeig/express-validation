const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    userid: Joi.string().required(),
  }).unknown(),
};

const app = createServer('get', '/user', schema, {}, { abortEarly: true });

describe('validate headers', () => {
  describe('when the request contains a valid header', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .get('/user')
        .set('accessToken', '4343434343')
        .set('userId', '3243243242');

      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the request contains an invalid header', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .get('/user')
        .set('accesstoken', '')
        .set('userId', '');

      expect(response.statusCode).toBe(400);
      expect(response.body.details.headers[0].path[0]).toBe('accesstoken');
    });
  });
});
