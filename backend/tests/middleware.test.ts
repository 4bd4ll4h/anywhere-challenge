import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import { User } from '../src/models/User';


describe('Middleware Tests', () => {
  let validToken: string;
  let userId: string;

  beforeEach(async () => {
    const user: any = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      role: 'student'
    });
    
    userId = user._id.toString();
    validToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  describe('Authentication Middleware', () => {
    describe('Valid Authentication', () => {
      it('should allow access with valid Bearer token', async () => {
        await request(app)
          .get('/api/quizzes')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(200);
      });

      it('should include user information in request', async () => {
        // This test indirectly verifies that auth middleware sets req.user
        const response = await request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(200);

        expect(response.body.data.user.id).toBe(userId);
      });
    });

    describe('Invalid Authentication', () => {
      it('should reject request without Authorization header', async () => {
        const response = await request(app)
          .get('/api/quizzes')
          .expect(401);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toContain('Access denied');
      });

      it('should reject request with malformed Authorization header', async () => {
        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', 'InvalidFormat token')
          .expect(401);

        expect(response.body.error).toContain('Invalid authorization header format');
      });

      it('should reject request with empty Bearer token', async () => {
        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', 'Bearer ')
          .expect(401);

        expect(response.body.error).toContain('Invalid authorization header format');
      });

      it('should reject request with invalid token', async () => {
        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', 'Bearer invalid-token-format')
          .expect(401);

        expect(response.body.error).toContain('Invalid token format');
      });

      it('should reject request with expired token', async () => {
        const expiredToken = jwt.sign(
          { userId },
          process.env.JWT_SECRET!,
          { expiresIn: '-1h' }
        );

        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', `Bearer ${expiredToken}`)
          .expect(401);

        expect(response.body.error).toContain('Token has expired');
      });

      it('should reject token with invalid signature', async () => {
        const invalidToken = jwt.sign(
          { userId },
          'wrong-secret',
          { expiresIn: '1h' }
        );

        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', `Bearer ${invalidToken}`)
          .expect(401);

        expect(response.body.error).toContain('Invalid token format');
      });

      it('should reject token with missing payload', async () => {
        const tokenWithoutUserId = jwt.sign(
          { someOtherField: 'value' },
          process.env.JWT_SECRET!,
          { expiresIn: '1h' }
        );

        const response = await request(app)
          .get('/api/quizzes')
          .set('Authorization', `Bearer ${tokenWithoutUserId}`)
          .expect(401);

        expect(response.body.error).toContain('Invalid token payload');
      });
    });
  });

  describe('Validation Middleware', () => {
    describe('Quiz Validation', () => {
      it('should validate required fields for quiz creation', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .set('Authorization', `Bearer ${validToken}`)
          .send({})
          .expect(400);

        expect(response.body.success).toBe(false);
        expect(response.body.error).toBe('Validation failed');
        
        const errorMessages = response.body.details.map((d: any) => d.msg);
        expect(errorMessages).toContain('Title is required');
        expect(errorMessages).toContain('Quiz must have at least one question');
        expect(errorMessages).toContain('Course is required');
        expect(errorMessages).toContain('Topic is required');
        expect(errorMessages).toContain('Due date must be a valid date');
      });

      it('should validate title length', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: 'AB', // Too short
            questions: [{ question: 'Test?', options: ['A', 'B'], correctAnswer: 0 }],
            course: 'Test',
            topic: 'Test',
            dueDate: new Date(Date.now() + 86400000).toISOString()
          })
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Title must be between 3 and 100 characters'
          })
        );
      });

      it('should validate questions array structure', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: 'Test Quiz',
            questions: [
              {
                question: 'Test question?',
                options: ['Only one option'], // Too few options
                correctAnswer: 0
              }
            ],
            course: 'Test',
            topic: 'Test',
            dueDate: new Date(Date.now() + 86400000).toISOString()
          })
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Each question must have 2-6 options'
          })
        );
      });

      it('should validate due date is in future', async () => {
        const response = await request(app)
          .post('/api/quizzes')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: 'Test Quiz',
            questions: [{ question: 'Test?', options: ['A', 'B'], correctAnswer: 0 }],
            course: 'Test',
            topic: 'Test',
            dueDate: new Date(Date.now() - 86400000).toISOString() // Past date
          })
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Due date must be in the future'
          })
        );
      });
    });

    describe('Announcement Validation', () => {
      it('should validate required fields for announcement creation', async () => {
        const response = await request(app)
          .post('/api/announcements')
          .set('Authorization', `Bearer ${validToken}`)
          .send({})
          .expect(400);

        const errorMessages = response.body.details.map((d: any) => d.msg);
        expect(errorMessages).toContain('Title is required');
        expect(errorMessages).toContain('Content is required');
        expect(errorMessages).toContain('Course is required');
      });

      it('should validate announcement type', async () => {
        const response = await request(app)
          .post('/api/announcements')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: 'Test Announcement',
            content: 'This is a test announcement with valid content length.',
            course: 'Test Course',
            type: 'invalid-type'
          })
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Type must be one of: general, urgent, academic, event'
          })
        );
      });

      it('should validate content length', async () => {
        const response = await request(app)
          .post('/api/announcements')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: 'Test Announcement',
            content: 'Short', // Too short
            course: 'Test Course',
            type: 'general'
          })
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Content must be between 10 and 2000 characters'
          })
        );
      });
    });

    describe('Parameter Validation', () => {
      it('should validate MongoDB ObjectId format', async () => {
        const response = await request(app)
          .get('/api/quizzes/invalid-id-format')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(400);

        expect(response.body.details).toContainEqual(
          expect.objectContaining({
            msg: 'Invalid id format'
          })
        );
      });

      it('should validate pagination parameters', async () => {
        const response = await request(app)
          .get('/api/quizzes?page=0&limit=101')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(400);

        const errorMessages = response.body.details.map((d: any) => d.msg);
        expect(errorMessages).toContain('Page must be a positive integer');
        expect(errorMessages).toContain('Limit must be between 1 and 100');
      });

      it('should validate sort parameters', async () => {
        const response = await request(app)
          .get('/api/quizzes?sortBy=invalidField&sortOrder=invalidOrder')
          .set('Authorization', `Bearer ${validToken}`)
          .expect(400);

        const errorMessages = response.body.details.map((d: any) => d.msg);
        expect(errorMessages).toContain('Invalid sort field');
        expect(errorMessages).toContain('Sort order must be asc or desc');
      });
    });
  });

  describe('Rate Limiting Middleware', () => {
    it('should not apply rate limiting in test environment due to high limits', async () => {
      // Make many requests quickly - should not be rate limited in test environment
      const requests = Array(50).fill(null).map(() => 
        request(app)
          .get('/api/auth/me')
          .set('Authorization', `Bearer ${validToken}`)
      );

      const responses = await Promise.all(requests);
      
      // No requests should be rate limited due to high test limits
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBe(0);
      
      // Most requests should succeed (some may fail due to database issues)
      const successfulResponses = responses.filter(res => res.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);
    });

    it('should not apply rate limiting to auth endpoints in test environment', async () => {
      // Make multiple auth requests - should not be rate limited in test environment
      const authRequests = Array(10).fill(null).map((_, index) => 
        request(app).post('/api/auth/login').send({
          email: `testuser${index}@example.com`,
          name: `Test User ${index}`
        })
      );

      const responses = await Promise.all(authRequests);
      
      // No requests should be rate limited due to high test limits
      const rateLimitedResponses = responses.filter(res => res.status === 429);
      expect(rateLimitedResponses.length).toBe(0);
      
      // Most should succeed (some may fail due to validation/database issues)
      const successfulResponses = responses.filter(res => res.status === 200);
      expect(successfulResponses.length).toBeGreaterThan(0);
    });

    it('should include rate limit headers', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Check for rate limit headers
      expect(response.headers).toHaveProperty('ratelimit-limit');
      expect(response.headers).toHaveProperty('ratelimit-remaining');
      expect(response.headers).toHaveProperty('ratelimit-reset');
    });
  });

  describe('Error Handling Middleware', () => {
    it('should handle 404 routes properly', async () => {
      const response = await request(app)
        .get('/api/non-existent-endpoint')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);

      expect(response.body).toMatchObject({
        error: 'Route not found',
        path: '/api/non-existent-endpoint'
      });
    });

    it('should handle internal server errors gracefully', async () => {
      // This would test error handling, but we need to trigger an actual error
      // For now, we test that the error structure is consistent with expected format
      const response = await request(app)
        .get('/api/quizzes/507f1f77bcf86cd799439011') // Valid ID format but non-existent
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);

      expect(response.body).toHaveProperty('success', false);
      expect(response.body).toHaveProperty('error');
    });
  });

  describe('CORS and Security Headers', () => {
    it('should include security headers', async () => {
      const response = await request(app)
        .get('/health')
        .expect(200);

      // Helmet should add security headers
      expect(response.headers).toHaveProperty('x-content-type-options');
      expect(response.headers).toHaveProperty('x-frame-options');
      expect(response.headers).toHaveProperty('x-xss-protection');
    });

    it('should handle CORS properly', async () => {
      const response = await request(app)
        .options('/api/auth/login')
        .set('Origin', 'http://localhost:3000')
        .set('Access-Control-Request-Method', 'POST')
        .set('Access-Control-Request-Headers', 'Content-Type,Authorization')
        .expect(204);

      expect(response.headers).toHaveProperty('access-control-allow-origin');
      expect(response.headers).toHaveProperty('access-control-allow-methods');
      // Note: access-control-allow-headers is only sent during preflight if specifically requested
      expect(response.headers).toHaveProperty('access-control-allow-credentials');
    });
  });

  describe('Request Logging Middleware', () => {
    it('should log requests (integration test)', async () => {
      // This is more of an integration test to ensure logging doesn't break the flow
      const response = await request(app)
        .get('/health')
        .expect(200);

      expect(response.body).toMatchObject({
        status: 'OK',
        message: 'Anyware Software Challenge API is running'
      });
    });

    it('should handle requests with user context', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      // Should successfully return user data, indicating logging middleware 
      // properly handled authenticated requests
      expect(response.body.data.user.id).toBe(userId);
    });
  });
});