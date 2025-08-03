import request from 'supertest';
import app from '../src/index';

describe('Simple Test', () => {
  it('should return health check', async () => {
    const response = await request(app)
      .get('/health')
      .expect(200);

    expect(response.body).toHaveProperty('status', 'OK');
    expect(response.body).toHaveProperty('message');
  });

  it('should return 404 for non-existent route', async () => {
    const response = await request(app)
      .get('/non-existent')
      .expect(404);

    expect(response.body).toHaveProperty('error', 'Route not found');
  });
});