import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

// Generate JWT Token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { 
      id: userId,
      userId: userId // Keep both for compatibility
    },
    process.env.JWT_SECRET || 'fallback-secret',
    { expiresIn: process.env.JWT_EXPIRES_IN ? process.env.JWT_EXPIRES_IN : '1h' } as jwt.SignOptions
  );
};


// @desc    Login user (simple login without credentials)
// @route   POST /api/auth/login
// @access  Public
export const login = async (req: Request, res: Response): Promise<void> => {
  try {
    // For this challenge, we'll create a default user or use an existing one
    let user = await User.findOne({ email: 'student@anyware.com' });

    if (!user) {
      // Create a default user if none exists
      user = await User.create({
        name: 'Talia',
        email: 'student@anyware.com',
        avatar: 'https://picsum.photos/200',
        role: 'student'
      });
    }

    const token = generateToken(user._id as string);

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        },
        token
      },
      message: 'Login successful'
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during login'
    });
  }
};

// @desc    Logout user
// @route   POST /api/auth/logout
// @access  Private
export const logout = async (req: Request, res: Response): Promise<void> => {
  try {
    // In a real application, you might want to blacklist the token
    // For this challenge, we'll just return a success response
    res.status(200).json({
      success: true,
      message: 'Logout successful'
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error during logout'
    });
  }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
export const getCurrentUser = async (req: Request & { user?: { userId?: string } }, res: Response): Promise<void> => {
  try {
    const userId = req.user?.userId;
    if (!userId) {
      res.status(401).json({
        success: false,
        error: 'Unauthorized: No user ID found in request'
      });
      return;
    }

    const user = await User.findById(userId).select('-__v');

    if (!user) {
      res.status(404).json({
        success: false,
        error: 'User not found'
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: {
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          avatar: user.avatar,
          role: user.role
        }
      }
    });
  } catch (error) {
    console.error('Get current user error:', error);
    res.status(500).json({
      success: false,
      error: 'Server error'
    });
  }
}; 