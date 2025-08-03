import express from 'express';
import {
  getQuizzes,
  getQuiz,
  createQuiz,
  updateQuiz,
  deleteQuiz,
  getUpcomingQuizzes
} from '../controllers/quizController';
import { auth } from '../middleware/auth';
import {
  validateCreateQuiz,
  validateUpdateQuiz,
  validateIdParam,
  validatePaginationQuery,
  validateCourseFilter
} from '../middleware/validation';

const router = express.Router();

// @route   GET /api/quizzes - Protected: requires authentication
router.get('/', auth, validatePaginationQuery, validateCourseFilter, getQuizzes);

// @route   GET /api/quizzes/upcoming - Protected: requires authentication
router.get('/upcoming', auth, validatePaginationQuery, validateCourseFilter, getUpcomingQuizzes);

// @route   GET /api/quizzes/:id - Protected: requires authentication
router.get('/:id', auth, validateIdParam, getQuiz);

// @route   POST /api/quizzes - Protected: requires authentication and validation
router.post('/', auth, validateCreateQuiz, createQuiz);

// @route   PUT /api/quizzes/:id - Protected: requires authentication and validation
router.put('/:id', auth, validateUpdateQuiz, updateQuiz);

// @route   DELETE /api/quizzes/:id - Protected: requires authentication and validation
router.delete('/:id', auth, validateIdParam, deleteQuiz);

export default router; 