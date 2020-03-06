const Joi = require('@hapi/joi');
const request = require('supertest');
const signature = require('cookie-signature');
const { createServer } = require('../../_mocks_/express');

const schema = {
  signedCookies: Joi.object({
    topsecret: Joi.string().required(),
  }),
};

const app = createServer('post', '/logout', schema, {}, { abortEarly: false }, null, 'itsasecret');

describe('Signed cookies', () => {
  describe('when the request contains a valid signed cookie', () => {
    it('should return a 200 ok response', async () => {

      const signed = signature.sign('test', 'itsasecret');

      const response = await request(app)
        .post('/logout')
        .set('Cookie', `topsecret=s:${signed}`)
        .send();

      expect(response.statusCode).toBe(200);
    });
  });

  describe('when the request contains a missing signed cookie', () => {
    it('should return a 400 ok response and a single error', async () => {
      const response = await request(app)
        .post('/logout')
        .set('Cookie', '')
        .send();

      expect(response.statusCode).toBe(400);
      expect(response.body.details.signedCookies.length).toBe(1);
      expect(response.body.details.signedCookies[0].path[0]).toBe('topsecret');
    });
  });
});
