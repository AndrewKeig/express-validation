const request = require('supertest');
const app = require('./app');

describe('validate params', () => {
  describe('when the request contains a valid parameter', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app).get('/account/1');
      expect(response.statusCode).toBe(200);
      expect(response.body.id).toEqual('1');
    });
  });

  describe('when the request contains an invalid parameter', () => {
    it('should return a 400 response', async () => {
      const response = await request(app).get('/account/a');
      expect(response.statusCode).toBe(400);
      expect(response.body.errors.params.length).toBe(1);
      expect(response.body.errors.params[0].path[0]).toBe('id');
    });
  });
});
