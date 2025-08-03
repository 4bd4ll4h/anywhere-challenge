import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import { User } from '../src/models/User';

describe('Auth Controller', () => {
  describe('POST /api/auth/login', () => {
    it('should create a new user and return token when no user exists', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            name: 'Talia',
            email: 'student@anyware.com',
            role: 'student'
          },
          token: expect.any(String)
        },
        message: 'Login successful'
      });

      // Verify user was created in database
      const user = await User.findOne({ email: 'student@anyware.com' });
      expect(user).toBeTruthy();
      expect(user?.name).toBe('Talia');
      expect(user?.role).toBe('student');
    });

    it('should return existing user when user already exists', async () => {
      // Create user first
      const existingUser: any = await User.create({
        name: 'Talia',
        email: 'student@anyware.com',
        avatar: 'https://via.placeholder.com/150',
        role: 'student'
      });

      const response = await request(app)
        .post('/api/auth/login')
        .expect(200);

      expect(response.body.data.user.id).toBe(existingUser._id.toString());
      expect(response.body.data.user.name).toBe('Talia');
    });

    it('should return a valid JWT token', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .expect(200);

      const { token } = response.body.data;
      
      // Verify token is valid
      const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
      expect(decoded.userId).toBeTruthy();
      expect(decoded.exp).toBeGreaterThan(Date.now() / 1000);
    });

    it('should handle database errors gracefully', async () => {
      // Mock User.findOne to throw an error
      const originalFindOne = User.findOne;
              User.findOne = jest.fn().mockRejectedValue(new Error('Database error'));

      const response = await request(app)
        .post('/api/auth/login')
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Server error during login'
      });

      // Restore original method
      User.findOne = originalFindOne;
    });
  });

  describe('POST /api/auth/logout', () => {
    it('should logout successfully with valid token', async () => {
      // First login to get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .expect(200);

      const token = loginResponse.body.data.token;

      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${token}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        message: 'Logout successful'
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access denied');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid token format');
    });

    it('should return 401 with malformed authorization header', async () => {
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', 'InvalidFormat token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid authorization header format');
    });
  });

  describe('GET /api/auth/me', () => {
    let validToken: string;
    let userId: string;

    beforeEach(async () => {
      // Create a user and get a valid token
      const loginResponse = await request(app)
        .post('/api/auth/login')
        .expect(200);
      
      validToken = loginResponse.body.data.token;
      userId = loginResponse.body.data.user.id;
    });

    it('should return user data with valid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body).toMatchObject({
        success: true,
        data: {
          user: {
            id: userId,
            name: 'Talia',
            email: 'student@anyware.com',
            role: 'student'
          }
        }
      });
    });

    it('should return 401 without token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access denied');
    });

    it('should return 401 with invalid token', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
    });

    it('should return 401 with expired token', async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { userId: userId },
        process.env.JWT_SECRET!,
        { expiresIn: '-1h' } // Already expired
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Token has expired');
    });

    it('should return 404 when user not found', async () => {
      // Create token with non-existent user ID
      const nonExistentUserId = '507f1f77bcf86cd799439011';
      const tokenWithInvalidUser = jwt.sign(
        { userId: nonExistentUserId },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${tokenWithInvalidUser}`)
        .expect(404);

      expect(response.body).toMatchObject({
        success: false,
        error: 'User not found'
      });
    });

    it('should handle database errors gracefully', async () => {
      // Mock User.findById to throw an error
      const originalFindById = User.findById;
              User.findById = jest.fn().mockReturnValue({
          select: jest.fn().mockRejectedValue(new Error('Database error'))
        });

      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(500);

      expect(response.body).toMatchObject({
        success: false,
        error: 'Server error'
      });

      // Restore original method
      User.findById = originalFindById;
    });
  });

  describe('JWT Token Generation', () => {
    it('should generate tokens with correct payload structure', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .expect(200);

      const { token } = response.body.data;
      const decoded = jwt.decode(token) as any;

      expect(decoded).toHaveProperty('userId');
      expect(decoded).toHaveProperty('iat');
      expect(decoded).toHaveProperty('exp');
      expect(decoded.exp - decoded.iat).toBe(3600); // 1 hour in seconds (configured in auth controller)
    });
  });

  describe('Rate Limiting', () => {
    it('should not rate limit in test environment due to high limits', async () => {
      // Make 10 requests quickly - should all succeed due to high test limits
      const requests = Array(10).fill(null).map((_, index) => 
        request(app).post('/api/auth/login').send({
          email: `ratelimit${index}@example.com`, // Unique email for each request
          name: `Rate Limit User ${index}`
        })
      );

      const responses = await Promise.all(requests);
      
      // No requests should be rate limited in test environment
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      const successfulResponses = responses.filter(res => res.status === 200);
      
      // No rate limiting should occur due to high test limits
      expect(rateLimitedResponses.length).toBe(0);
      
      // Some requests may succeed, some may fail due to database conflicts
      // but NONE should be rate limited (429)
      expect(successfulResponses.length).toBeGreaterThan(0);
      expect(responses.length).toBe(10);
    });
  });
}); 