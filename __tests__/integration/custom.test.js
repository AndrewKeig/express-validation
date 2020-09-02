const Joi = require('joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  body: Joi.object({
    email: Joi.string()
      .email()
      .custom(() => {
        throw new Error('woops');
      })
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};


describe('validate custom', () => {
  describe('when the request contains custom func', () => {
    it('should return a 400 response', async () => {
      const app = createServer('post', '/login', schema, {}, { stripUnknown: false });

      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
      };

      const response = await request(app)
        .post('/login')
        .send(login);

      expect(response.body.details.body[0].message).toBe('"email" failed custom validation because woops');
      expect(response.statusCode).toBe(400);
    });
  });
});
