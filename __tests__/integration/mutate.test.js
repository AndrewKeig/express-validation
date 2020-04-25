const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  body: Joi.object({
    firstname: Joi.string().default('Andrew'),
    lastname: Joi.string().default('Keig'),
    age: Joi.number(),
    registered: Joi.boolean().default(true),
  }),
};

const mutateApp = createServer('post', '/defaults', schema, { mutate: true }, {}, 'body');
const nonMutateApp = createServer('post', '/defaults', schema, {}, {}, 'body');

describe('Mutate', () => {
  describe('when mutate is true', () => {
    it('should return the request joi parsed values', async () => {
      const response = await request(mutateApp)
        .post('/defaults')
        .send({ firstname: 'Jane', lastname: 'Doe', age: '23' });

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('Jane');
      expect(response.body.lastname).toBe('Doe');
      expect(response.body.registered).toBe(true);
      expect(response.body.age).toBe(23);
    });
  });

  describe('when mutate is false', () => {
    it('should return original request values', async () => {
      const response = await request(nonMutateApp)
        .post('/defaults')
        .send({ firstname: 'Jane', lastname: 'Doe', age: '23' });

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('Jane');
      expect(response.body.lastname).toBe('Doe');
      expect(response.body.registered).toBe(undefined);
      expect(response.body.age).toBe('23');
    });
  });
});
