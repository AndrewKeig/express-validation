const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const generateUsername = context => {
  if (context && context.firstname && context.lastname) {
    return `${context.firstname.toLowerCase()}-${context.lastname.toLowerCase()}`;
  }
};

generateUsername.description = 'generated username';

const schema = {
  body: Joi.object({
    username: Joi.string().default(generateUsername),
    firstname: Joi.string().default('Andrew'),
    lastname: Joi.string().default('Keig'),
    created: Joi.date().default(Date.now),
    registered: Joi.boolean().default(true),
    values: Joi.array().default(['1']),
  }),
};

const app = createServer('post', '/defaults', schema, { context: true }, {}, 'body');

describe('Defaults', () => {
  describe('when the values are missing', () => {
    it('should return the request with default values', async () => {
      const response = await request(app)
        .post('/defaults')
        .send({ firstname: 'Jane', lastname: 'Doe' });

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('Jane');
      expect(response.body.lastname).toBe('Doe');
      expect(response.body.username).toBe('jane-doe');
      expect(response.body).toHaveProperty('created');
      expect(response.body.registered).toBe(true);
      expect(response.body.values[0]).toBe('1');
    });
  });

  describe('when no values', () => {
    it('should return the request with default values', async () => {
      const response = await request(app)
        .post('/defaults')
        .send({});

      expect(response.statusCode).toBe(200);
      expect(response.body.firstname).toBe('Andrew');
      expect(response.body.lastname).toBe('Keig');
      expect(response.body).not.toHaveProperty('username');
      expect(response.body).toHaveProperty('created');
      expect(response.body.registered).toBe(true);
      expect(response.body.values[0]).toBe('1');
    });
  });
});
