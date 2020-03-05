const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
};

const app = createServer('get', '/account/:id', schema, {}, { abortEarly: true }, 'params');

describe('validate params', () => {
  describe('when the request contains a valid parameter', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app).get('/account/1');
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual('1');
    });
  });

  describe('when the request contains an invalid parameter', () => {
    it('should return a 400 response', async () => {
      const response = await request(app).get('/account/a');
      expect(response.statusCode).toBe(400);
      expect(response.body.details.params.length).toBe(1);
      expect(response.body.details.params[0].path[0]).toBe('id');
    });
  });
});
