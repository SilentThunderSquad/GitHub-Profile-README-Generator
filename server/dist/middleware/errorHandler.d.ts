import { Request, Response, NextFunction } from 'express';
import { AppError } from '../utils/errors';
/**
 * Global error handling middleware
 * Should be added last in the middleware chain
 */
export declare const errorHandler: (err: Error | AppError, req: Request, res: Response, next: NextFunction) => void;
/**
 * Middleware to catch async errors in route handlers
 * Wrap route handlers with this to automatically catch promise rejections
 * Example: router.get('/path', asyncHandler(async (req, res) => { ... }))
 */
export declare const asyncHandler: (fn: Function) => (req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=errorHandler.d.ts.map