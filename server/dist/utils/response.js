import { AppError } from './errors';
/**
 * Send successful response
 */
export const sendSuccess = (res, data, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
        timestamp: new Date().toISOString(),
    });
};
/**
 * Send paginated response
 */
export const sendPaginated = (res, data, total, limit, offset, statusCode = 200) => {
    res.status(statusCode).json({
        success: true,
        data,
        total,
        limit,
        offset,
        timestamp: new Date().toISOString(),
    });
};
/**
 * Send error response
 */
export const sendError = (res, error) => {
    const statusCode = error instanceof AppError ? error.statusCode : 500;
    const code = error instanceof AppError ? error.code : 'INTERNAL_ERROR';
    const message = error.message || 'An unexpected error occurred';
    res.status(statusCode).json({
        success: false,
        error: message,
        code,
        statusCode,
        timestamp: new Date().toISOString(),
    });
};
/**
 * Parse query parameters for pagination
 */
export const getPaginationParams = (query) => {
    const limit = Math.min(parseInt(query.limit) || 20, 100);
    const offset = Math.max(parseInt(query.offset) || 0, 0);
    return { limit, offset };
};
//# sourceMappingURL=response.js.map