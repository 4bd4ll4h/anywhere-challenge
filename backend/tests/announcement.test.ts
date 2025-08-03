import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import { User } from '../src/models/User';
import { Announcement } from '../src/models/Announcement';

describe('Announcement Controller', () => {
  let validToken: string;
  let userId: string;

  beforeEach(async () => {
    // Create user and get token
    const user: any = await User.create({
      name: 'Test User',
      email: 'test@example.com',
      role: 'student'
    });
    
    userId = user._id.toString();
    validToken = jwt.sign({ userId }, process.env.JWT_SECRET!, { expiresIn: '1h' });
  });

  describe('GET /api/announcements', () => {
    beforeEach(async () => {
      // Create sample announcements
      await Announcement.create([
        {
          title: 'Welcome to Math Class',
          content: 'Welcome to the new semester of Mathematics. We will cover algebra, geometry, and calculus.',
          course: 'Mathematics',
          type: 'general',
          author: { // Required field
            name: 'Dr. Smith',
            role: 'teacher'
          },
          createdBy: userId
        },
        {
          title: 'Urgent: Exam Schedule Change',
          content: 'The midterm exam has been moved from Friday to next Monday due to technical issues.',
          course: 'Science',
          type: 'urgent',
          author: { // Required field
            name: 'Prof. Johnson',
            role: 'admin'
          },
          createdBy: userId
        },
        {
          title: 'Assignment Deadline',
          content: 'Reminder that your physics assignment is due next week.',
          course: 'Science',
          type: 'academic',
          author: { // Required field
            name: 'Dr. Wilson',
            role: 'teacher'
          },
          createdBy: userId
        }
      ]);
    });

    it('should get all announcements with valid token', async () => {
      const response = await request(app)
        .get('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(3);
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('content');
      expect(response.body.data[0]).toHaveProperty('type');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/announcements')
        .expect(401);
    });

    it('should filter announcements by course', async () => {
      const response = await request(app)
        .get('/api/announcements?course=Mathematics')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].course).toBe('Mathematics');
      expect(response.body.data[0].title).toBe('Welcome to Math Class');
    });

    it('should paginate results correctly', async () => {
      const response = await request(app)
        .get('/api/announcements?page=1&limit=2')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
    });

    it('should sort announcements by creation date (newest first)', async () => {
      const response = await request(app)
        .get('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      const announcements = response.body.data;
      for (let i = 1; i < announcements.length; i++) {
        const current = new Date(announcements[i].createdAt);
        const previous = new Date(announcements[i - 1].createdAt);
        expect(current.getTime()).toBeLessThanOrEqual(previous.getTime());
      }
    });

    it('should validate page parameter', async () => {
      await request(app)
        .get('/api/announcements?page=0')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });

    it('should validate limit parameter', async () => {
      await request(app)
        .get('/api/announcements?limit=101')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });

    it('should validate invalid sort field', async () => {
      await request(app)
        .get('/api/announcements?sortBy=invalidField')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });
  });

  describe('GET /api/announcements/:id', () => {
    let announcementId: string;

    beforeEach(async () => {
      const announcement: any = await Announcement.create({
        title: 'Test Announcement',
        content: 'This is a test announcement with detailed content for testing purposes.',
        course: 'Computer Science',
        type: 'academic',
        author: { // Required field
          name: 'Dr. Test',
          role: 'teacher'
        },
        createdBy: userId
      });
      announcementId = announcement._id.toString();
    });

    it('should get announcement by valid ID', async () => {
      const response = await request(app)
        .get(`/api/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Announcement');
      expect(response.body.data.content).toContain('detailed content');
      expect(response.body.data.type).toBe('academic');
    });

    it('should return 404 for non-existent announcement', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/api/announcements/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 400 for invalid announcement ID format', async () => {
      await request(app)
        .get('/api/announcements/invalid-id-format')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get(`/api/announcements/${announcementId}`)
        .expect(401);
    });
  });

  describe('POST /api/announcements', () => {
    const validAnnouncementData = {
      title: 'New Course Material Available',
      content: 'New learning materials have been uploaded to the course portal. Please review the updated syllabus and reading list.',
      course: 'Literature',
      type: 'academic',
      author: { // Required field
        name: 'Prof. Literature',
        role: 'teacher'
      }
    };

    it('should create announcement with valid data', async () => {
      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validAnnouncementData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Course Material Available');
      expect(response.body.data.type).toBe('academic');
      expect(response.body.data.createdBy).toBe(userId);

      // Verify announcement was created in database
      const announcement = await Announcement.findById(response.body.data._id);
      expect(announcement).toBeTruthy();
      expect(announcement?.title).toBe('New Course Material Available');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/announcements')
        .send(validAnnouncementData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      
      const errors = response.body.details.map((d: any) => d.msg);
      expect(errors).toContain('Title is required');
      expect(errors).toContain('Content is required');
      expect(errors).toContain('Course is required');
    });

    it('should validate title length constraints', async () => {
      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validAnnouncementData, title: 'AB' })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          msg: 'Title must be between 3 and 100 characters'
        })
      );
    });

    it('should validate content length constraints', async () => {
      const shortContent = 'Too short';
      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validAnnouncementData, content: shortContent })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          msg: 'Content must be between 10 and 2000 characters'
        })
      );
    });

    it('should validate announcement type', async () => {
      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validAnnouncementData, type: 'invalid-type' })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          msg: 'Type must be one of: general, urgent, academic, event'
        })
      );
    });

    it('should trim whitespace from title and content', async () => {
      const dataWithWhitespace = {
        ...validAnnouncementData,
        title: '  Whitespace Test  ',
        content: '  This content has extra whitespace.  '
      };

      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send(dataWithWhitespace)
        .expect(201);

      expect(response.body.data.title).toBe('Whitespace Test');
      expect(response.body.data.content).toBe('This content has extra whitespace.');
    });
  });

  describe('PUT /api/announcements/:id', () => {
    let announcementId: string;

    beforeEach(async () => {
      const announcement: any = await Announcement.create({
        title: 'Original Announcement',
        content: 'This is the original content that will be updated during testing.',
        course: 'Original Course',
        type: 'general',
        author: { // Required field
          name: 'Dr. Original',
          role: 'teacher'
        },
        createdBy: userId
      });
      announcementId = announcement._id.toString();
    });

    it('should update announcement with valid data', async () => {
      const updateData = {
        title: 'Updated Announcement Title',
        content: 'This is the updated content with new information for students.',
        type: 'urgent'
      };

      const response = await request(app)
        .put(`/api/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Announcement Title');
      expect(response.body.data.content).toContain('updated content');
      expect(response.body.data.type).toBe('urgent');

      // Verify update in database
      const updatedAnnouncement = await Announcement.findById(announcementId);
      expect(updatedAnnouncement?.title).toBe('Updated Announcement Title');
    });

    it('should return 404 for non-existent announcement', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .put(`/api/announcements/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .put(`/api/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'AB' }) // Too short
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({
          msg: 'Title must be between 3 and 100 characters'
        })
      );
    });

    it('should allow partial updates', async () => {
      const response = await request(app)
        .put(`/api/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ type: 'urgent' })
        .expect(200);

      expect(response.body.data.type).toBe('urgent');
      expect(response.body.data.title).toBe('Original Announcement'); // Should remain unchanged
    });

    it('should return 401 without token', async () => {
      await request(app)
        .put(`/api/announcements/${announcementId}`)
        .send({ title: 'Updated' })
        .expect(401);
    });

    it('should validate ID format', async () => {
      await request(app)
        .put('/api/announcements/invalid-id')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated' })
        .expect(400);
    });
  });

  describe('DELETE /api/announcements/:id', () => {
    let announcementId: string;

    beforeEach(async () => {
      const announcement: any   = await Announcement.create({
        title: 'Announcement to Delete',
        content: 'This announcement will be deleted during testing.',
        course: 'Test Course',
        type: 'general',
        author: { // Required field
          name: 'Dr. Delete',
          role: 'admin'
        },
        createdBy: userId
      });
      announcementId = announcement._id.toString();
    });

    it('should delete announcement successfully', async () => {
      const response = await request(app)
        .delete(`/api/announcements/${announcementId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Announcement deleted successfully');

      // Verify announcement was deleted from database
      const deletedAnnouncement = await Announcement.findById(announcementId);
      expect(deletedAnnouncement).toBeNull();
    });

    it('should return 404 for non-existent announcement', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .delete(`/api/announcements/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .delete(`/api/announcements/${announcementId}`)
        .expect(401);
    });

    it('should validate ID format', async () => {
      await request(app)
        .delete('/api/announcements/invalid-id')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });
  });

  describe('Announcement Types and Priority', () => {
    it('should create announcements with different types', async () => {
      const types = ['general', 'urgent', 'academic'];
      
      for (const type of types) {
        const response = await request(app)
          .post('/api/announcements')
          .set('Authorization', `Bearer ${validToken}`)
          .send({
            title: `${type} Announcement`,
            content: `This is a ${type} type announcement for testing purposes.`,
            course: 'Test Course',
            type,
            author: { // Required field
              name: 'Dr. TypeTest',
              role: 'teacher'
            }
          })
          .expect(201);

        expect(response.body.data.type).toBe(type);
      }
    });

    it('should handle urgent announcements properly', async () => {
      const urgentData = {
        title: 'URGENT: System Maintenance',
        content: 'The learning management system will be down for maintenance from 2 AM to 4 AM tonight.',
        course: 'All Courses',
        type: 'urgent',
        author: { // Required field
          name: 'Dr. Urgent',
          role: 'admin'
        }
      };

      const response = await request(app)
        .post('/api/announcements')
        .set('Authorization', `Bearer ${validToken}`)
        .send(urgentData)
        .expect(201);

      expect(response.body.data.type).toBe('urgent');
      expect(response.body.data.title).toContain('URGENT');
    });
  });
});