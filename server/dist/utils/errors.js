// Custom error classes for the application
export class AppError extends Error {
    constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
        super(message);
        this.message = message;
        this.statusCode = statusCode;
        this.code = code;
        Object.setPrototypeOf(this, AppError.prototype);
    }
}
export class ValidationError extends AppError {
    constructor(message, code = 'VALIDATION_ERROR') {
        super(message, 400, code);
        Object.setPrototypeOf(this, ValidationError.prototype);
    }
}
export class AuthenticationError extends AppError {
    constructor(message = 'Unauthorized', code = 'UNAUTHORIZED') {
        super(message, 401, code);
        Object.setPrototypeOf(this, AuthenticationError.prototype);
    }
}
export class AuthorizationError extends AppError {
    constructor(message = 'Forbidden', code = 'FORBIDDEN') {
        super(message, 403, code);
        Object.setPrototypeOf(this, AuthorizationError.prototype);
    }
}
export class NotFoundError extends AppError {
    constructor(resource = 'Resource', code = 'NOT_FOUND') {
        super(`${resource} not found`, 404, code);
        Object.setPrototypeOf(this, NotFoundError.prototype);
    }
}
export class ConflictError extends AppError {
    constructor(message, code = 'CONFLICT') {
        super(message, 409, code);
        Object.setPrototypeOf(this, ConflictError.prototype);
    }
}
export class RateLimitError extends AppError {
    constructor(message = 'Too many requests', retryAfter) {
        super(message, 429, 'RATE_LIMIT_EXCEEDED');
        this.retryAfter = retryAfter;
        Object.setPrototypeOf(this, RateLimitError.prototype);
    }
}
export class InternalServerError extends AppError {
    constructor(message = 'Internal server error', code = 'INTERNAL_ERROR') {
        super(message, 500, code);
        Object.setPrototypeOf(this, InternalServerError.prototype);
    }
}
//# sourceMappingURL=errors.js.map