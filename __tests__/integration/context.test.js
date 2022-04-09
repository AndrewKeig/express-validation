const Joi = require('joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

describe('Context', () => {
  describe('when passed as true', () => {
    const schema = {
      body: Joi.object({
        id: Joi.string()
          .valid(Joi.ref('$params.id'))
          .required(),
      }),
    };

    const app = createServer('post', '/context/:id', schema, { context: true }, {});

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

  describe('when passed as false', () => {
    const schema = {
      body: Joi.object({
        id: Joi.string()
          .valid(Joi.ref('$foo.bar'))
          .required(),
      }),
    };

    const joiContext = {
      foo: {
        bar: 'abc',
      },
    };

    const app = createServer('post', '/context/:id', schema, { context: false }, { context: joiContext });

    // Regression test for https://github.com/AndrewKeig/express-validation/issues/153
    describe('and the joi options specify another context', () => {
      it('should not overwrite the context passed in the joi options object', async () => {
        const response = await request(app)
          .post('/context/abc')
          .send({ id: 'abc' });

        expect(response.statusCode).toBe(200);
      });
    });
  });
});
