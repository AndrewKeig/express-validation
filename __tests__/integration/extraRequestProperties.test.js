const Joi = require('joi');
const express = require('express');
const request = require('supertest');
const { validate } = require('../../lib/index');

const schema = {
  query: Joi.object({
    greeting: Joi.string(),
  }),
};

describe('when another piece of middleware has added extra properties to the request object', () => {
  it('should return a 20 response', async () => {
    const app = express();
    app.use((req, res, next) => {
      req.something = 123;
      next();
    });
    app.get('/hello', validate(schema), (req, res) => {
      res.status(200).json({ [req.query.greeting]: 'there' });
    });
    // eslint-disable-next-line no-unused-vars
    app.use((err, req, res, next) => res.status(err.statusCode).json(err));

    const response = await request(app)
      .get('/hello?greeting=yo');

    expect(response.statusCode).toBe(200);
    expect(response.body).toEqual({ yo: 'there' });
  });
});
