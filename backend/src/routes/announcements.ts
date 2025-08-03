import express from 'express';
import {
  getAnnouncements,
  getAnnouncement,
  createAnnouncement,
  updateAnnouncement,
  deleteAnnouncement
} from '../controllers/announcementController';
import { auth } from '../middleware/auth';
import {
  validateCreateAnnouncement,
  validateUpdateAnnouncement,
  validateIdParam,
  validatePaginationQuery,
  validateCourseFilter
} from '../middleware/validation';

const router = express.Router();

// @route   GET /api/announcements - Protected: requires authentication
router.get('/', auth, validatePaginationQuery, validateCourseFilter, getAnnouncements);

// @route   GET /api/announcements/:id - Protected: requires authentication
router.get('/:id', auth, validateIdParam, getAnnouncement);

// @route   POST /api/announcements - Protected: requires authentication and validation
router.post('/', auth, validateCreateAnnouncement, createAnnouncement);

// @route   PUT /api/announcements/:id - Protected: requires authentication and validation
router.put('/:id', auth, validateUpdateAnnouncement, updateAnnouncement);

// @route   DELETE /api/announcements/:id - Protected: requires authentication and validation
router.delete('/:id', auth, validateIdParam, deleteAnnouncement);

export default router; 