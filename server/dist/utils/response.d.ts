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
export declare const sendSuccess: <T>(res: Response, data: T, statusCode?: number) => void;
/**
 * Send paginated response
 */
export declare const sendPaginated: <T>(res: Response, data: T[], total: number, limit: number, offset: number, statusCode?: number) => void;
/**
 * Send error response
 */
export declare const sendError: (res: Response, error: Error | AppError) => void;
/**
 * Parse query parameters for pagination
 */
export declare const getPaginationParams: (query: any) => {
    limit: number;
    offset: number;
};
//# sourceMappingURL=response.d.ts.map