import { Request, Response, NextFunction } from 'express';
import Logger from '../utils/logger';
import { AuthRequest } from './auth';

// Enhanced request logging middleware
export const requestLogger = (req: AuthRequest, res: Response, next: NextFunction) => {
  const startTime = Date.now();
  
  // Log the incoming request
  Logger.http(`${req.method} ${req.originalUrl}`, {
    method: req.method,
    url: req.originalUrl,
    ip: req.ip,
    userAgent: req.get('User-Agent'),
    userId: req.user?.id || 'anonymous',
    timestamp: new Date().toISOString()
  });

  // Use res.on('finish') instead of overriding res.end to avoid middleware conflicts
  res.on('finish', () => {
    const duration = Date.now() - startTime;
    const logLevel = res.statusCode >= 400 ? 'warn' : 'http';
    
    Logger.log(logLevel, `${req.method} ${req.originalUrl} ${res.statusCode} ${duration}ms`, {
      method: req.method,
      url: req.originalUrl,
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
      userId: req.user?.id || 'anonymous',
      contentLength: res.get('Content-Length') || '0',
      timestamp: new Date().toISOString()
    });
  });

  next();
};

// Error logging middleware
export const errorLogger = (error: Error, req: Request, res: Response, next: NextFunction) => {
  Logger.error(`${error.name}: ${error.message}`, {
    error: {
      name: error.name,
      message: error.message,
      stack: error.stack,
    },
    request: {
      method: req.method,
      url: req.originalUrl,
      ip: req.ip,
      userAgent: req.get('User-Agent'),
    },
    timestamp: new Date().toISOString()
  });

  next(error);
};

// Database operation logging
export const logDatabaseOperation = (operation: string, model: string, data?: any) => {
  Logger.debug(`Database ${operation}`, {
    operation,
    model,
    data: data ? JSON.stringify(data) : undefined,
    timestamp: new Date().toISOString()
  });
};

// Authentication logging
export const logAuthEvent = (event: string, email?: string, success: boolean = true, error?: string) => {
  const logLevel = success ? 'info' : 'warn';
  Logger.log(logLevel, `Auth ${event}`, {
    event,
    email,
    success,
    error,
    timestamp: new Date().toISOString()
  });
};

// Security event logging
export const logSecurityEvent = (event: string, ip: string, details?: any) => {
  Logger.warn(`Security Event: ${event}`, {
    event,
    ip,
    details,
    severity: 'security',
    timestamp: new Date().toISOString()
  });
};