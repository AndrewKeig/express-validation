const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  body: Joi.object({
    firstname: Joi.string().default('Andrew'),
    lastname: Joi.string().default('Keig'),
    age: Joi.number().default(23),
    registered: Joi.boolean().default(true),
  }),
};

const contextFalseApp = createServer('post', '/defaults', schema, { context: false }, {}, 'body');
const contextTrueApp = createServer('post', '/defaults', schema, { context: true }, {}, 'body');

describe('Default values', () => {
  describe('when context is true', () => {
    it('should return the request joi parsed values', async () => {
      const response = await request(contextTrueApp)
        .post('/defaults')
        .send({});

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('Andrew');
      expect(response.body.lastname).toBe('Keig');
      expect(response.body.registered).toBe(true);
      expect(response.body.age).toBe(23);
    });
  });

  describe('when context is false  and no values', () => {
    it('should return original request values of unndefined', async () => {
      const response = await request(contextFalseApp)
        .post('/defaults')
        .send({});

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe(undefined);
      expect(response.body.lastname).toBe(undefined);
      expect(response.body.registered).toBe(undefined);
      expect(response.body.age).toBe(undefined);
    });
  });

  describe('when context is false', () => {
    it('should return original request values', async () => {
      const response = await request(contextFalseApp)
        .post('/defaults')
        .send({ firstname: 'John', lastname: 'Doe', registered: false, age: 25 });

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('John');
      expect(response.body.lastname).toBe('Doe');
      expect(response.body.registered).toBe(false);
      expect(response.body.age).toBe(25);
    });
  });
});
