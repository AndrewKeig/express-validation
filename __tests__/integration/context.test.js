const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  body: Joi.object({
    id: Joi.string()
      .valid(Joi.ref('$params.id'))
      .required(),
  }),
};

const app = createServer('post', '/context/:id', schema, { context: true }, {});

describe('Context', () => {
  describe('when the schema contains a reference to the request object', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .post('/context/1')
        .send({ id: '1' });

      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the schema contains an invalid reference to the request object', () => {
    it('should return a 400 response', async () => {
      const response = await request(app)
        .post('/context/1')
        .send({ id: '2' });

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body[0].path[0]).toBe('id');
    });
  });
});
