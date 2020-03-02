const request = require('supertest');
const app = require('./app');

describe('validate query', () => {
  describe('when the request contains a valid query', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app).get('/search?q=true');
      expect(response.status).toBe(200);
    });
  });

  describe('when the request contains an invalid query', () => {
    it('should return a 400 response', async () => {
      const response = await request(app).get('/search?q=');
      expect(response.status).toBe(400);
      expect(response.body.errors.query[0].path[0]).toBe('q');
    });
  });
});
