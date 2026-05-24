import { AppError } from '../utils/errors';
import { sendError } from '../utils/response';
/**
 * Global error handling middleware
 * Should be added last in the middleware chain
 */
export const errorHandler = (err, req, res, next) => {
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
export const asyncHandler = (fn) => {
    return (req, res, next) => {
        Promise.resolve(fn(req, res, next)).catch(next);
    };
};
//# sourceMappingURL=errorHandler.js.map