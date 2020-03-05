const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  cookies: Joi.object({
    id: Joi.string()
      .regex(/^[0-9]+$/)
      .required(),
    session: Joi.string()
      .regex(/^[a-zA-Z0-9]{16}$/)
      .required(),
  }),
};

const app = createServer('post', '/logout', schema, {}, { abortEarly: false  });

describe('validate cookies', () => {
  describe('when the request contains a valid payload', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', 'id=1; session=0123456789abcdef;')
        .send();

      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the request contains an invalid payload', () => {
    it('should return a 400 ok response and a single error', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', 'id=1; session=abc;')
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.body.details.cookies.length).toBe(1);
      expect(response.body.details.cookies[0].path[0]).toBe('session');
    });
  });

  describe('when the request has a missing item in payload', () => {
    it('should return a 400 ok response and a single error', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', 'id=1;')
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.body.details.cookies.length).toBe(1);
      expect(response.body.details.cookies[0].path[0]).toBe('session');
    });
  });

  describe('when the request has multiple missing items in payload', () => {
    it('should return a 400 ok response and two errors', async () => {
      const response = await request(app)
        .post('/logout')
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.body.details.cookies.length).toBe(2);
      expect(response.body.details.cookies[0].path[0]).toBe('id');
      expect(response.body.details.cookies[1].path[0]).toBe('session');
    });
  });

  describe('when the request has extra items in payload', () => {
    it('should return a 400 ok response and one error', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', 'id=1; session=0123456789abcdef; a=b;')
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.body.details.cookies.length).toBe(1);
      expect(response.body.details.cookies[0].path[0]).toBe('a');
    });
  });
});
