const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};


describe('validate strip unknown', () => {
  describe('when the request contains unknown properties and joi stripUnknown is false', () => {
    it('should return a 400 response', async () => {
      const app = createServer('post', '/login', schema, {}, { stripUnknown: false });

      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
        removeThis: 'xx',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.body.details.body[0].message).toBe('"removeThis" is not allowed');
      expect(response.statusCode).toBe(400);
    });
  });

  describe('when the request contains unknown properties and joi stripUnknown is true', () => {
    it('should return a 200 response', async () => {
      const app = createServer('post', '/login', schema, {}, { stripUnknown: true });
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
        removeThis: 'xx',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.statusCode).toBe(200);
    });
  });
});
