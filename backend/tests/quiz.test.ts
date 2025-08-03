import request from 'supertest';
import jwt from 'jsonwebtoken';
import app from '../src/index';
import { User } from '../src/models/User';
import { Quiz } from '../src/models/Quiz';

describe('Quiz Controller', () => {
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

  describe('GET /api/quizzes', () => {
    beforeEach(async () => {
      // Create sample quizzes
      await Quiz.create([
        {
          title: 'Math Quiz 1',
          description: 'Basic math questions',
          questions: [
            {
              question: 'What is 2 + 2?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1
            }
          ],
          course: 'Mathematics',
          subject: 'Algebra', // Required field
          topic: 'Arithmetic',
          totalPoints: 50, // Required field
          type: 'quiz',
          dueDate: new Date(Date.now() + 86400000) // Tomorrow
        },
        {
          title: 'Science Quiz',
          description: 'Physics questions',
          questions: [
            {
              question: 'What is gravity?',
              options: ['Force', 'Energy', 'Mass', 'Speed'],
              correctAnswer: 0
            }
          ],
          course: 'Science',
          subject: 'Physics', // Required field
          topic: 'Physics',
          totalPoints: 75, // Required field
          type: 'quiz',
          dueDate: new Date(Date.now() + 172800000) // Day after tomorrow
        }
      ]);
    });

    it('should get all quizzes with valid token', async () => {
      const response = await request(app)
        .get('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data[0]).toHaveProperty('title');
      expect(response.body.data[0]).toHaveProperty('course');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/quizzes')
        .expect(401);
    });

    it('should filter quizzes by course', async () => {
      const response = await request(app)
        .get('/api/quizzes?course=Mathematics')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].course).toBe('Mathematics');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/quizzes?page=1&limit=1')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });

    it('should validate invalid page parameter', async () => {
      await request(app)
        .get('/api/quizzes?page=0')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });

    it('should validate invalid limit parameter', async () => {
      await request(app)
        .get('/api/quizzes?limit=101')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });
  });

  describe('GET /api/quizzes/upcoming', () => {
    beforeEach(async () => {
      await Quiz.create([
        {
          title: 'Past Quiz',
          description: 'This quiz is overdue',
          questions: [{ question: 'Test?', options: ['A', 'B'], correctAnswer: 0 }],
          course: 'Test',
          subject: 'Testing', // Required field
          topic: 'Test',
          totalPoints: 25, // Required field
          type: 'quiz',
          dueDate: new Date(Date.now() - 86400000) // Yesterday
        },
        {
          title: 'Upcoming Quiz',
          description: 'This quiz is upcoming',
          questions: [{ question: 'Test?', options: ['A', 'B'], correctAnswer: 0 }],
          course: 'Test',
          subject: 'Testing', // Required field
          topic: 'Test',
          totalPoints: 30, // Required field
          type: 'quiz',
          dueDate: new Date(Date.now() + 86400000) // Tomorrow
        }
      ]);
    });

    it('should get only upcoming quizzes', async () => {
      const response = await request(app)
        .get('/api/quizzes/upcoming')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].title).toBe('Upcoming Quiz');
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get('/api/quizzes/upcoming')
        .expect(401);
    });
  });

  describe('GET /api/quizzes/:id', () => {
    let quizId: string;

    beforeEach(async () => {
      const quiz: any = await Quiz.create({
        title: 'Test Quiz',
        description: 'Test description',
        questions: [
          {
            question: 'What is testing?',
            options: ['Important', 'Optional', 'Boring', 'Hard'],
            correctAnswer: 0
          }
        ],
        course: 'Software Engineering',
        subject: 'Software Testing', // Required field
        topic: 'Testing',
        totalPoints: 100, // Required field
        type: 'quiz',
        dueDate: new Date(Date.now() + 86400000)
      });
      quizId = quiz._id.toString();
    });

    it('should get quiz by valid ID', async () => {
      const response = await request(app)
        .get(`/api/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Test Quiz');
      expect(response.body.data.questions).toHaveLength(1);
    });

    it('should return 404 for non-existent quiz', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .get(`/api/quizzes/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 400 for invalid quiz ID format', async () => {
      await request(app)
        .get('/api/quizzes/invalid-id')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .get(`/api/quizzes/${quizId}`)
        .expect(401);
    });
  });

  describe('POST /api/quizzes', () => {
    const validQuizData = {
      title: 'New Quiz',
      description: 'A new quiz for testing',
      questions: [
        {
          question: 'What is Node.js?',
          options: ['Runtime', 'Database', 'Browser', 'Language'],
          correctAnswer: 0
        },
        {
          question: 'What is Express?',
          options: ['Framework', 'Database', 'Runtime', 'Language'],
          correctAnswer: 0
        }
      ],
      course: 'Web Development',
      subject: 'JavaScript', // Required field
      topic: 'Backend',
      totalPoints: 100, // Required field
      type: 'quiz',
      dueDate: new Date(Date.now() + 86400000).toISOString()
    };

    it('should create quiz with valid data', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send(validQuizData)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('New Quiz');
      expect(response.body.data.questions).toHaveLength(2);

      // Verify quiz was created in database
      const quiz: any = await Quiz.findById(response.body.data._id);
      expect(quiz).toBeTruthy();
    });

    it('should return 401 without token', async () => {
      await request(app)
        .post('/api/quizzes')
        .send(validQuizData)
        .expect(401);
    });

    it('should validate required fields', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send({})
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Validation failed');
      expect(response.body.details).toContainEqual(
        expect.objectContaining({ msg: 'Title is required' })
      );
    });

    it('should validate title length', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validQuizData, title: 'AB' })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({ 
          msg: 'Title must be between 3 and 100 characters' 
        })
      );
    });

    it('should validate questions array', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ ...validQuizData, questions: [] })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({ 
          msg: 'Quiz must have at least one question' 
        })
      );
    });

    it('should validate due date is in future', async () => {
      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send({ 
          ...validQuizData, 
          dueDate: new Date(Date.now() - 86400000).toISOString() 
        })
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({ 
          msg: 'Due date must be in the future' 
        })
      );
    });

    it('should validate question options count', async () => {
      const invalidQuizData = {
        ...validQuizData,
        questions: [{
          question: 'Test question?',
          options: ['Only one option'],
          correctAnswer: 0
        }]
      };

      const response = await request(app)
        .post('/api/quizzes')
        .set('Authorization', `Bearer ${validToken}`)
        .send(invalidQuizData)
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({ 
          msg: 'Each question must have 2-6 options' 
        })
      );
    });
  });

  describe('PUT /api/quizzes/:id', () => {
    let quizId: string;

    beforeEach(async () => {
      const quiz: any = await Quiz.create({
        title: 'Original Quiz',
        description: 'Original description',
        questions: [
          {
            question: 'Original question?',
            options: ['A', 'B', 'C', 'D'],
            correctAnswer: 0
          }
        ],
        course: 'Original Course',
        subject: 'Original Subject', // Required field
        topic: 'Original Topic',
        totalPoints: 50, // Required field
        type: 'quiz',
        dueDate: new Date(Date.now() + 86400000)
      });
      quizId = quiz._id.toString();
    });

    it('should update quiz with valid data', async () => {
      const updateData = {
        title: 'Updated Quiz',
        description: 'Updated description'
      };

      const response = await request(app)
        .put(`/api/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.title).toBe('Updated Quiz');
      expect(response.body.data.description).toBe('Updated description');
    });

    it('should return 404 for non-existent quiz', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .put(`/api/quizzes/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'Updated' })
        .expect(404);
    });

    it('should validate update data', async () => {
      const response = await request(app)
        .put(`/api/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .send({ title: 'AB' }) // Too short
        .expect(400);

      expect(response.body.details).toContainEqual(
        expect.objectContaining({ 
          msg: 'Title must be between 3 and 100 characters' 
        })
      );
    });

    it('should return 401 without token', async () => {
      await request(app)
        .put(`/api/quizzes/${quizId}`)
        .send({ title: 'Updated' })
        .expect(401);
    });
  });

  describe('DELETE /api/quizzes/:id', () => {
    let quizId: string;

    beforeEach(async () => {
      const quiz: any = await Quiz.create({
        title: 'Quiz to Delete',
        description: 'This will be deleted',
        questions: [
          {
            question: 'Delete me?',
            options: ['Yes', 'No'],
            correctAnswer: 0
          }
        ],
        course: 'Test Course',
        subject: 'Test Subject', // Required field
        topic: 'Test Topic',
        totalPoints: 20, // Required field
        type: 'quiz',
        dueDate: new Date(Date.now() + 86400000)
      });
      quizId = quiz._id.toString();
    });

    it('should delete quiz successfully', async () => {
      const response = await request(app)
        .delete(`/api/quizzes/${quizId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toBe('Quiz deleted successfully');

      // Verify quiz was deleted from database
      const deletedQuiz = await Quiz.findById(quizId);
      expect(deletedQuiz).toBeNull();
    });

    it('should return 404 for non-existent quiz', async () => {
      const nonExistentId = '507f1f77bcf86cd799439011';
      await request(app)
        .delete(`/api/quizzes/${nonExistentId}`)
        .set('Authorization', `Bearer ${validToken}`)
        .expect(404);
    });

    it('should return 401 without token', async () => {
      await request(app)
        .delete(`/api/quizzes/${quizId}`)
        .expect(401);
    });

    it('should validate quiz ID format', async () => {
      await request(app)
        .delete('/api/quizzes/invalid-id')
        .set('Authorization', `Bearer ${validToken}`)
        .expect(400);
    });
  });
});