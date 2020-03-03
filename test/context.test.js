const request = require('supertest');
const app = require('./app');

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
      expect(response.body.errors.body[0].path[0]).toBe('id');
    });
  });
});
