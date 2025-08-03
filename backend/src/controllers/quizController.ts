import { Request, Response } from 'express';
import { Quiz } from '../models/Quiz';

// @desc    Get all quizzes
// @route   GET /api/quizzes
// @access  Public
export const getQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, type, isActive, course } = req.query;
    
    const query: any = {};
    
    if (type) query.type = type;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (course) query.course = course;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const quizzes = await Quiz.find(query)
      .sort({ dueDate: 1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Quiz.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: quizzes,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get quizzes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single quiz
// @route   GET /api/quizzes/:id
// @access  Public
export const getQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findById(req.params.id).lean();
    
    if (!quiz) {
      res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    console.error('Get quiz error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create quiz
// @route   POST /api/quizzes
// @access  Private
export const createQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.create(req.body);
    
    res.status(201).json({
      success: true,
      data: quiz,
      message: 'Quiz created successfully'
    });
  } catch (error) {
    console.error('Create quiz error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update quiz
// @route   PUT /api/quizzes/:id
// @access  Private
export const updateQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!quiz) {
      res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: quiz,
      message: 'Quiz updated successfully'
    });
  } catch (error) {
    console.error('Update quiz error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete quiz
// @route   DELETE /api/quizzes/:id
// @access  Private
export const deleteQuiz = async (req: Request, res: Response): Promise<void> => {
  try {
    const quiz = await Quiz.findByIdAndDelete(req.params.id);
    
    if (!quiz) {
      res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Quiz deleted successfully'
    });
  } catch (error) {
    console.error('Delete quiz error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get upcoming quizzes
// @route   GET /api/quizzes/upcoming
// @access  Public
export const getUpcomingQuizzes = async (req: Request, res: Response): Promise<void> => {
  try {
    const now = new Date();
    const upcomingQuizzes = await Quiz.find({
      dueDate: { $gte: now },
      isActive: true
    })
      .sort({ dueDate: 1 })
      .limit(5)
      .lean();
    
    res.status(200).json({
      success: true,
      data: upcomingQuizzes
    });
  } catch (error) {
    console.error('Get upcoming quizzes error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 