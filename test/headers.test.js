const request = require('supertest');
const app = require('./app');

describe('validate headers', () => {
  describe('when the request contains a valid header', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .get('/user')
        .set('accessToken', '4343434343')
        .set('userId', '3243243242');

      expect(response.status).toBe(200);
    });
  });

  describe('when the request contains an invalid header', () => {
    it('should return a 200 ok response', async () => {
      const response = await request(app)
        .get('/user')
        .set('accesstoken', '')
        .set('userId', '');

      expect(response.status).toBe(400);
      expect(response.body.errors.headers[0].path[0]).toBe('accesstoken');
    });
  });
});
