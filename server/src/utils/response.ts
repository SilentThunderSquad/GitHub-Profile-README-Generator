import { Response } from 'express';
import { AppError } from './errors';

export interface SuccessResponse<T> {
  success: true;
  data: T;
  timestamp: string;
}

export interface ErrorResponse {
  success: false;
  error: string;
  code: string;
  statusCode: number;
  timestamp: string;
}

export interface PaginatedResponse<T> {
  success: true;
  data: T[];
  total: number;
  limit: number;
  offset: number;
  timestamp: string;
}

/**
 * Send successful response
 */
export const sendSuccess = <T>(res: Response, data: T, statusCode = 200) => {
  res.status(statusCode).json({
    success: true,
    data,
    timestamp: new Date().toISOString(),
  });
};

/**
 * Send paginated response
 */
export const sendPaginated = <T>(
  res: Response,
  data: T[],
  total: number,
  limit: number,
  offset: number,
  statusCode = 200
) => {
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
export const sendError = (res: Response, error: Error | AppError) => {
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
export const getPaginationParams = (query: any) => {
  const limit = Math.min(parseInt(query.limit) || 20, 100);
  const offset = Math.max(parseInt(query.offset) || 0, 0);
  return { limit, offset };
};
