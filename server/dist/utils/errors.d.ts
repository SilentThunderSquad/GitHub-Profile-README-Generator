export declare class AppError extends Error {
    message: string;
    statusCode: number;
    code: string;
    constructor(message: string, statusCode?: number, code?: string);
}
export declare class ValidationError extends AppError {
    constructor(message: string, code?: string);
}
export declare class AuthenticationError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class AuthorizationError extends AppError {
    constructor(message?: string, code?: string);
}
export declare class NotFoundError extends AppError {
    constructor(resource?: string, code?: string);
}
export declare class ConflictError extends AppError {
    constructor(message: string, code?: string);
}
export declare class RateLimitError extends AppError {
    constructor(message?: string, retryAfter?: number);
    retryAfter?: number;
}
export declare class InternalServerError extends AppError {
    constructor(message?: string, code?: string);
}
//# sourceMappingURL=errors.d.ts.map