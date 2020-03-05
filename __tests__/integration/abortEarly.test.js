const Joi = require('@hapi/joi');
const request = require('supertest');
const { createServer } = require('../../_mocks_/express');

const schema = {
  headers: Joi.object({
    accesstoken: Joi.string().required(),
    userid: Joi.string().required(),
  }).unknown(),
  params: Joi.object({
    id: Joi.number()
      .integer()
      .required(),
  }),
  body: Joi.object({
    email: Joi.string()
      .email()
      .required(),
    password: Joi.string()
      .regex(/[a-zA-Z0-9]{3,30}/)
      .required(),
  }),
};

const app = createServer('put', '/user/:id', schema, {}, { abortEarly: false });

describe('Abort early', () => {
  describe('when the request contains a valid payload and headers', () => {
    it('should return a 200 ok response', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
      };

      const response = await request(app)
        .put('/user/1')
        .set('accessToken', '4343434343')
        .set('userId', '3243243242')
        .send(login);

      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the request contains a valid payload and headers, with invalid parameter', () => {
    it('should return a 200 ok response', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '12356',
      };

      const response = await request(app)
        .put('/user/e')
        .set('accessToken', '4343434343')
        .set('userId', '3243243242')
        .send(login);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.params.length).toBe(1);
      expect(response.body.details.params[0].path[0]).toBe('id');
    });
  });

  describe('when the request contains a missing payload and valid headers', () => {
    it('should return a 400 ok response and two errors', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '',
      };

      const response = await request(app)
        .put('/user/1')
        .set('accessToken', '4343434343')
        .set('userId', '3243243242')
        .send(login);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.body.length).toBe(1);
      expect(response.body.details.body[0].path[0]).toBe('password');
    });
  });

  describe('when the request contains a valid payload and missing headers', () => {
    it('should return a 400 ok response and two errors', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '32323432',
      };

      const response = await request(app)
        .put('/user/1')
        .set('accessToken', '')
        .set('userId', '3243243242')
        .send(login);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.headers.length).toBe(1);
      expect(response.body.details.headers[0].path[0]).toBe('accesstoken');
    });
  });

  describe('when the request contains an invalid payload and missing headers', () => {
    it('should return a 400 ok response and two errors', async () => {
      const login = {
        email: 'andrew.keig@gmail.com',
        password: '',
      };

      const response = await request(app)
        .put('/user/1')
        .set('accessToken', '')
        .set('userId', '3243243242')
        .send(login);

      expect(response.statusCode).toBe(400);
      expect(response.body.details.headers.length).toBe(1);
      expect(response.body.details.headers[0].path[0]).toBe('accesstoken');

      expect(response.body.details.body.length).toBe(1);
      expect(response.body.details.body[0].path[0]).toBe('password');
    });
  });
});
