import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { logSecurityEvent } from './logging';

export interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    name: string;
    iat?: number;
    exp?: number;
  };
}

export const auth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.header('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      res.status(401).json({ 
        success: false, 
        error: 'Access denied. Invalid authorization header format.' 
      });
      return;
    }

    const token = authHeader.replace('Bearer ', '');

    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.' 
      });
      return;
    }

    // Verify JWT_SECRET exists
    const jwtSecret = process.env.JWT_SECRET;
    if (!jwtSecret) {
      logSecurityEvent('Missing JWT_SECRET', req.ip || 'unknown', { 
        url: req.originalUrl,
        method: req.method 
      });
      res.status(500).json({ 
        success: false, 
        error: 'Server configuration error.' 
      });
      return;
    }

    const decoded = jwt.verify(token, jwtSecret) as any;
    
    // Validate decoded token structure
    if (!(decoded.id || decoded.userId)) {
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token payload.' 
      });
      return;
    }

    req.user = decoded;
    next();
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      logSecurityEvent('Token expired', req.ip || 'unknown', { 
        url: req.originalUrl,
        method: req.method,
        error: 'Token expired'
      });
      res.status(401).json({ 
        success: false, 
        error: 'Token has expired. Please login again.' 
      });
    } else if (error instanceof jwt.JsonWebTokenError) {
      logSecurityEvent('Invalid token format', req.ip || 'unknown', { 
        url: req.originalUrl,
        method: req.method,
        error: 'Invalid token format'
      });
      res.status(401).json({ 
        success: false, 
        error: 'Invalid token format.' 
      });
    } else {
      logSecurityEvent('Token verification failed', req.ip || 'unknown', { 
        url: req.originalUrl,
        method: req.method,
        error: error instanceof Error ? error.message : 'Unknown error'
      });
      res.status(401).json({ 
        success: false, 
        error: 'Token verification failed.' 
      });
    }
  }
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const token = req.header('Authorization')?.replace('Bearer ', '');

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any;
      req.user = decoded;
    }
    
    next();
  } catch (error) {
    // Continue without authentication
    next();
  }
}; 