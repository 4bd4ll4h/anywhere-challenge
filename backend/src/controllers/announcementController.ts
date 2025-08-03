import { Request, Response } from 'express';
import { Announcement } from '../models/Announcement';

// @desc    Get all announcements
// @route   GET /api/announcements
// @access  Public
export const getAnnouncements = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, priority, isActive, course } = req.query;
    
    const query: any = {};
    
    if (priority) query.priority = priority;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (course) query.course = course;
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const announcements = await Announcement.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .lean();
    
    const total = await Announcement.countDocuments(query);
    
    res.status(200).json({
      success: true,
      data: announcements,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get announcements error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Get single announcement
// @route   GET /api/announcements/:id
// @access  Public
export const getAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const announcement = await Announcement.findById(req.params.id).lean();
    
    if (!announcement) {
      res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: announcement
    });
  } catch (error) {
    console.error('Get announcement error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Create announcement
// @route   POST /api/announcements
// @access  Private
export const createAnnouncement = async (req: Request & { user?: { id: string; userId: string } }, res: Response): Promise<void> => {
  try {
    // Automatically set createdBy from authenticated user
    const announcementData = {
      ...req.body,
      createdBy: req.user?.userId || req.user?.id
    };
    
    const announcement = await Announcement.create(announcementData);
    
    res.status(201).json({
      success: true,
      data: announcement,
      message: 'Announcement created successfully'
    });
  } catch (error) {
    console.error('Create announcement error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Update announcement
// @route   PUT /api/announcements/:id
// @access  Private
export const updateAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const announcement = await Announcement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    
    if (!announcement) {
      res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      data: announcement,
      message: 'Announcement updated successfully'
    });
  } catch (error) {
    console.error('Update announcement error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
};

// @desc    Delete announcement
// @route   DELETE /api/announcements/:id
// @access  Private
export const deleteAnnouncement = async (req: Request, res: Response): Promise<void> => {
  try {
    const announcement = await Announcement.findByIdAndDelete(req.params.id);
    
    if (!announcement) {
      res.status(404).json({
        success: false,
        error: 'Announcement not found'
      });
      return;
    }
    
    res.status(200).json({
      success: true,
      message: 'Announcement deleted successfully'
    });
  } catch (error) {
    console.error('Delete announcement error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 