import { body, param, query, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      error: 'Validation failed',
      details: errors.array()
    });
    return;
  }
  next();
};

// MongoDB ObjectId validation
export const validateObjectId = (fieldName: string) => {
  return param(fieldName)
    .custom((value) => {
      if (!mongoose.Types.ObjectId.isValid(value)) {
        throw new Error(`Invalid ${fieldName} format`);
      }
      return true;
    });
};

// Quiz validations
export const validateCreateQuiz = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('questions')
    .isArray({ min: 1 })
    .withMessage('Quiz must have at least one question'),
  
  body('questions.*.question')
    .trim()
    .notEmpty()
    .withMessage('Question text is required'),
  
  body('questions.*.options')
    .isArray({ min: 2, max: 6 })
    .withMessage('Each question must have 2-6 options'),
  
  body('questions.*.correctAnswer')
    .isInt({ min: 0 })
    .withMessage('Correct answer must be a valid option index'),
  
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  
  body('topic')
    .trim()
    .notEmpty()
    .withMessage('Topic is required'),
  
  body('dueDate')
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

export const validateUpdateQuiz = [
  validateObjectId('id'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('description')
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage('Description cannot exceed 500 characters'),
  
  body('questions')
    .optional()
    .isArray({ min: 1 })
    .withMessage('Quiz must have at least one question'),
  
  body('questions.*.question')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Question text cannot be empty'),
  
  body('questions.*.options')
    .optional()
    .isArray({ min: 2, max: 6 })
    .withMessage('Each question must have 2-6 options'),
  
  body('questions.*.correctAnswer')
    .optional()
    .isInt({ min: 0 })
    .withMessage('Correct answer must be a valid option index'),
  
  body('course')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course cannot be empty'),
  
  body('topic')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Topic cannot be empty'),
  
  body('dueDate')
    .optional()
    .isISO8601()
    .withMessage('Due date must be a valid date')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Due date must be in the future');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Announcement validations
export const validateCreateAnnouncement = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .trim()
    .notEmpty()
    .withMessage('Content is required')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('course')
    .trim()
    .notEmpty()
    .withMessage('Course is required'),
  
  body('type')
    .isIn(['general', 'urgent', 'academic', 'event'])
    .withMessage('Type must be one of: general, urgent, academic, event'),
  
  handleValidationErrors
];

export const validateUpdateAnnouncement = [
  validateObjectId('id'),
  
  body('title')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Title cannot be empty')
    .isLength({ min: 3, max: 100 })
    .withMessage('Title must be between 3 and 100 characters'),
  
  body('content')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Content cannot be empty')
    .isLength({ min: 10, max: 2000 })
    .withMessage('Content must be between 10 and 2000 characters'),
  
  body('course')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course cannot be empty'),
  
  body('type')
    .optional()
    .isIn(['general', 'urgent', 'academic', 'event'])
    .withMessage('Type must be one of: general, urgent, academic, event'),
  
  handleValidationErrors
];

// Query parameter validations
export const validatePaginationQuery = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  
  query('sortBy')
    .optional()
    .isIn(['createdAt', 'updatedAt', 'title', 'dueDate'])
    .withMessage('Invalid sort field'),
  
  query('sortOrder')
    .optional()
    .isIn(['asc', 'desc'])
    .withMessage('Sort order must be asc or desc'),
  
  handleValidationErrors
];

export const validateCourseFilter = [
  query('course')
    .optional()
    .trim()
    .notEmpty()
    .withMessage('Course filter cannot be empty'),
  
  handleValidationErrors
];

// Common ID validation
export const validateIdParam = [
  validateObjectId('id'),
  handleValidationErrors
];