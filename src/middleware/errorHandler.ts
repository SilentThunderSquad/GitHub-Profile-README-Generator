import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';

/**
 * Global error handling middleware
 * Should be added last in the middleware chain
 */
export const errorHandler = (err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
  console.error('[Error Handler]', {
    message: err.message,
    code: err instanceof AppError ? err.code : 'UNKNOWN',
    statusCode: err instanceof AppError ? err.statusCode : 500,
    path: req.path,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  sendError(res, err);
};

/**
 * Middleware to catch async errors in route handlers
 * Wrap route handlers with this to automatically catch promise rejections
 * Example: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
