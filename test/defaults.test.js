const request = require('supertest');
const app = require('./app');

describe('Mutation', () => {
  describe('when the values are missing', () => {
    it('should return the request with default values', async () => {
      const response = await request(app)
        .post('/defaults')
        .send({ firstname: 'Jane', lastname: 'Doe' });

      expect(response.status).toBe(200);
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

      expect(response.status).toBe(200);
      expect(response.body.firstname).toBe('Andrew');
      expect(response.body.lastname).toBe('Keig');
      expect(response.body).not.toHaveProperty('username');
      expect(response.body).toHaveProperty('created');
      expect(response.body.registered).toBe(true);
      expect(response.body.values[0]).toBe('1');
    });
  });
});
